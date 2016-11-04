'use strict';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import River from './River.jsx';
import Single from './Single.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Sidebar from './Sidebar.jsx';
import * as actions from '../actions/index.js';
import htmlescape from 'htmlescape';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.handleAllClickEvents = this.handleAllClickEvents.bind(this);
	}

	handleAllClickEvents(event) {

		const href = event.target.getAttribute('href');
		const apiUrl = this.props.template_tags.home_url + '/wp-json/reactifywp/v1/route';
		let self = this;

		if ('A' === event.target.nodeName && href) {
			if (href.match(this.props.template_tags.home_url) && !href.match(/\/wp-admin/i)) {
				event.preventDefault();

				this.props.actions.navigate(href.replace(this.props.template_tags.home_url, ''), apiUrl, this.props.user).then(function() {
					document.querySelector('title').innerHTML = self.props.route.document_title;
				});
			}
		}
	}

    render() {
    	let initialStateString = 'window.__INITIAL_STATE__ = ' + htmlescape(this.props) + ';';

        return (
			<div id="page" className="site">
				<div onClick={this.handleAllClickEvents} className="site-inner">

            		<Header {...this.props} />

            		<div id="content" className="site-content">
            			{ 'single' === this.props.route.type ?

            				<Single {...this.props} />
            			:
            				<River {...this.props} />
            			}

            			<Sidebar {...this.props} />
            		</div>
            		<Footer {...this.props} />
            	</div>

                <div dangerouslySetInnerHTML={{__html: this.props.template_tags.wp_footer}}></div>

                <div dangerouslySetInnerHTML={{__html: this.props.template_tags.admin_bar}}></div>

                <script dangerouslySetInnerHTML={{__html: initialStateString}}></script>
            </div>
        );
    }
}

const mapStateToProps = state => ({
	route: state.get('route'),
	posts: state.get('posts'),
	template_tags: state.get('template_tags'),
	nav_menus: state.get('nav_menus'),
	sidebars: state.get('sidebars'),
	user: state.get('user'),
});


const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(actions, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App)
