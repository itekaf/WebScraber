import React from 'react';
import Popup from 'reactjs-popup';
import Loading from './Loading';

class ControlledPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: true,
			message: props && props.message ? props.message : ':(',
			parrent: props && props.parrent ? props.parrent : {},
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	openModal() {
		this.setState({open: true});
	};
	closeModal() {
		this.state.parrent.setState({loading: new Loading()});
		this.setState({open: false});
	};

	render() {
		return (
			<div>
				<Popup
					open={this.state.open}
					closeOnDocumentClick
					onClose={this.closeModal}
				>
					<div className="modal show" tabIndex="-1" role="dialog">
						<div className="modal-dialog" role="document">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title"></h5>
									<button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div className="modal-body">
									{this.state.message}
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" data-dismiss="modal"
										onClick={this.closeModal}>Закрыть</button>
								</div>
							</div>
						</div>
					</div>
				</Popup>
			</div>
		);
	}
};

export default ControlledPopup;
