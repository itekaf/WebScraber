import React from 'react';
import Loading from './../../Loading';
import Animation from './../../Animation';
import helper from './../../core/helper';

class SettingsView extends React.Component {
    constructor(props) {
        super(props);

        const crud = props && props.crud ? props.crud : {};
        const settings = crud.get.main.settings();

        this.state = {
            crud: crud,
            loading: new Loading(),
            settings: settings ? settings : {},
        };

        this.handleSave = this.handleSave.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleSpeed = this.handleSpeed.bind(this);
        this.handleWebsite = this.handleWebsite.bind(this);
        this.handleTempFolder = this.handleTempFolder.bind(this);
        this.handleImageSpeed = this.handleImageSpeed.bind(this);
        this.handleImageFolder = this.handleImageFolder.bind(this);
    };


    handleSave() {
        this.state.crud.set.main.settings(this.state.settings);
        helper.loading.result(this, 'Настройки успешно сохранены');
    }
    handleName(event) {}
    handleSpeed(event) {
        const settings = this.state.settings;
        settings.speed = event.target.value;
        this.setState({settings: settings});
    }
    handleImageSpeed(event) {
        const settings = this.state.settings;
        settings.imageSpeed = event.target.value;
        this.setState({settings: settings});
    }
    handleWebsite(event) {}
    handleImageFolder(event) {
        const settings = this.state.settings;
        settings.imageFolder = event.target.value;
        this.setState({settings: settings});
    }
    handleTempFolder(event) {
        const settings = this.state.settings;
        settings.tempFolder = event.target.value;
        this.setState({settings: settings});
    }


    render() {
        return (
            <div className="settings">
                <div className="wrap">
                    {helper.modal(this)}
                    <header className="toolbar toolbar-header">
                        <h1 className="title">Настройки</h1>
                    </header>
                    <div className="content">
                        {this.state.loading.active ?
                            <Animation key={Math.random()} /> :
                            <form onSubmit={this.handleSave}>
                                <div className="form-group flex">
                                    <label>Сайт:</label>
                                    <input type="text" disabled className="form-control" value={this.state.settings.website} onChange={this.handleWebsite}/>
                                </div>
                                <div className="form-group flex">
                                    <label>Имя:</label>
                                    <input type="text" disabled className="form-control" value={this.state.settings.name} onChange={this.handleName}/>
                                </div>
                                <div className="form-group flex">
                                    <label>Cкорость парсинга, в мс:</label>
                                    <input type="number" className="form-control" min="250" value={this.state.settings.speed} onChange={this.handleSpeed}/>
                                </div>
                                <div className="form-group flex">
                                    <label>Cкорость скачивания картинок, в мс:</label>
                                    <input type="number" className="form-control" min="350" value={this.state.settings.imageSpeed} onChange={this.handleImageSpeed}/>
                                </div>
                                <div className="form-group flex">
                                    <label>Папка для экспорта:</label>
                                    <input type="text" className="form-control" value={this.state.settings.tempFolder} onChange={this.handleTempFolder}/>
                                </div>
                                <div className="form-group flex">
                                    <label>Папка для картинок:</label>
                                    <input type="text" className="form-control" value={this.state.settings.imageFolder} onChange={this.handleImageFolder}/>
                                </div>
                            </form>
                        }
                    </div>
                </div>
                <footer className="toolbar toolbar-footer">
                    <div className="toolbar-actions flex">
                        <input type="submit" className="btn btn-positive pull-right" value="Сохранить"
                            onClick={this.handleSave} />
                    </div>
                </footer>
            </div>
        );
    }
};

export default SettingsView;
