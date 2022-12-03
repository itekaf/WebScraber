import rp from 'request-promise';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import React from 'react';
import Loading from './../../Loading';
import Animation from './../../Animation';
import helper from './../helper';

class LoginView extends React.Component {
	constructor(props) {
		super(props);

		const crud = props && props.crud ? props.crud : {};
		const cookies = props && props.cookies ? props.cookies : {};
		const login = crud.get.main.login();
		const user = login || undefined;

		this.state = {
			crud: crud,
			cookies: cookies,
			username: user ? user.name : '',
			password: user ? user.password: '',
			loading: new Loading(),
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChangeUserName = this.handleChangeUserName.bind(this);
		this.handleChangeUserPassword = this.handleChangeUserPassword.bind(this);
	}

	handleChangeUserName(event) {
		this.setState({username: event.target.value});
	}
	handleChangeUserPassword(event) {
		this.setState({password: event.target.value});
	}
	handleSubmit(e) {
		e.preventDefault();
		helper.loading.waiting(this);
		const login = this.state.crud.get.main.login();

		const loginForm = login.post.form;
		loginForm['log'] = this.state.username;
		loginForm['pwd'] = this.state.password;

		const settings = {
			method: 'POST',
			jar: this.state.cookies.login(),
			resolveWithFullResponse: true,
			uri: login.post.uri,
			form: loginForm,
		};
		rp(settings)
			.then(() => {
				throw new Error('Something wrong');
			})
			.catch((err) => {
				if (err.statusCode === 302) {
					const rawHeaders = err.response.rawHeaders;

					this.state.crud.set.main.sessions([rawHeaders[13], rawHeaders[17], rawHeaders[25]]);
					this.state.crud.set.main.login(this.state.username, 'login.name');
					this.state.crud.set.main.login(this.state.password, 'login.password');

					helper.loading.result(this, 'Вы успешно авторизовались');
				} else {
					throw new Error('Error code is wrong');
				}
			})
			.catch((err) => {
				helper.loading.result(this, err.message);
				console.error(err);
			});
	}

	render() {
		return (
			<div className="login">
				<div className="wrap">
					<header className="toolbar toolbar-header">
						<h1 className="title">Авторизация</h1>
					</header>
					{helper.modal(this)}
					{this.state.loading.active ?
						<Animation key={Math.random()} />
						: <form onSubmit={this.handleSubmit}>
							<div className="form-group flex">
								<label>Логин:</label>
								<input type="email" className="form-control" placeholder="Email"
									value={this.state.username}
									onChange={this.handleChangeUserName}/>
							</div>
							<div className="form-group flex">
								<label>Пароль:</label>
								<input type="password" className="form-control" placeholder="Password"
									value={this.state.password}
									onChange={this.handleChangeUserPassword}/>
							</div>
						</form>
					}
				</div>
				<footer className="toolbar toolbar-footer">
					<div className="toolbar-actions flex">
						<input type="submit" className="btn btn-positive" value="Войти"
							onClick={this.handleSubmit}/>
					</div>
				</footer>
			</div>
		);
	}
};

export default LoginView;
