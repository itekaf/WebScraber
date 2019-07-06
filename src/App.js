import React from 'react';
import Content from './components/Content';
import Sidebar from './components/Sidebar';

export default class App extends React.Component {
	render() {
		return (
			<div className="window">
				<div className="window-content">
					<div className="pane-group">
						<div className="pane pane-sm sidebar" >
							<Sidebar />
						</div>
						<div className="pane content">
							<Content />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
