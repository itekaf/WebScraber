import React from 'react';
import Loading from './../../Loading';
import Animation from './../../Animation';
import helper from './../helper';
import CategoriesAbstrat from './../models/CategoryAbstract';
import ReactTable from 'react-table';


class CategoriesView extends React.Component {
    constructor(props) {
        super(props);

        const Category = props && props.category ? props.category : CategoriesAbstrat;
        const crud = props && props.crud ? props.crud : {};
        const categories = crud.get.categories();
        const settings = props && props.settings ? props.settings : {};

        this.state = {
            Category: Category,
            crud: crud,
            _value: new Category(),
            categories: categories ? categories.map((item) => new Category(item)) : [],
            loading: new Loading(),
            settings: settings,
            file: false,
        };

        this.handleAdd = this.handleAdd.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleImportSubmit = this.handleImportSubmit.bind(this);

        this.handleChangeUri = this.handleChangeUri.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleImportFile = this.handleImportFile.bind(this);
    }

    clickActive(item) {
        const categories = this.state.categories.map((elem) => {
            if (elem.id === item.id) {
                elem.active = !elem.active;
            }
            return elem;
        } );
        this.setState({categories: categories});
    }

    clickTrash(item) {
        const categories = this.state.categories.filter((elem) => elem.id !== item.id);
        this.state.crud.remove.categories({id: item.id});
        this.setState({categories: categories});
    }

    handleImportFile(event) {
        const value = this.state._value;
        value.file = event.target.files[0].path;
        this.setState({_value: value});
    }

    handleChangeUri(event) {
        const value = this.state._value;
        value.uri = event.target.value;
        this.setState({_value: value});
    }

    handleChangeName(event) {
        const value = this.state._value;
        value.name = event.target.value;
        this.setState({_value: value});
    }

    handleSave() {
        const categories = this.state.categories;

        helper.loading.waiting(this);
        // TODO: state.file move to flags
        const tasks = categories.map((item) => item.create(!this.state.file));

        Promise.all(tasks).then((categories) => {
            categories.forEach((category) => {
                this.state.crud.remove.categories({
                    name: category.name,
                    uri: category.uri,
                });
                this.state.crud.set.categories.push(category);
            });
            this.setState({categories: categories, file: false});
            helper.loading.result(this, 'Категории успешно сохранены и обновлены');
        }).catch((err) => {
            helper.loading.result(this, err.message, false);
            console.log(err);
        });
    }

    handleAdd() {
        const dublicate = this.state.categories.filter((item) =>
            item.name === this.state._value.name ||
            item.uri === this.state._value.uri);

        if (dublicate.length !== 0 ||
            this.state._value.uri === '' ||
            this.state._value.name === ' ') {
            helper.loading.result(this, 'Такая группа уже существует, или не задано имя или ссылка', false);
            return;
        }
        this.setState((state) => {
            const value = new this.state.Category(state._value);
            return {
                categories: state.categories.concat(value),
                _value: new this.state.Category(),
            };
        });
    }

    async handleImportSubmit(e) {
        helper.loading.waiting(this);
        try {
            e.preventDefault();
            const filePath = this.state._value.file;
            const fileCategory = await this.state._value.importFile(filePath);
            const clearCategory = fileCategory.reduce((acum, category) => {
                const categoryIndex = acum.findIndex((x) => x.name === category.name);
                categoryIndex === -1
                    ? acum.push(category)
                    : (acum[categoryIndex] = category);
                return acum;
            }, this.state.categories);

            helper.loading.result(this, 'Парсинг файла успешно завершен', false);

            this.setState({
                categories: clearCategory,
                file: true,
            });
        } catch (e) {
            helper.loading.result(this, 'Произошла ошибка', false);
        }
    }

    render() {
        const columns = [
            {
                id: 'id',
                Header: 'Id',
                accessor: (d) => d.id,
            },
            {
                id: 'name',
                Header: 'Имя',
                accessor: (d) => d.name,
            },
            {
                id: 'uri',
                Header: 'Ссылка',
                accessor: (d) => d.uri,
            },
            {
                id: 'pages',
                Header: 'Страниц',
                accessor: (d) => d.pages,
            },
            {
                id: 'items',
                Header: 'Товаров',
                accessor: (d) => d.items.length,
            },
            {
                id: 'error',
                Header: 'Ошибка',
                accessor: (d) => d.error,
            },
            {
                id: 'active',
                Header: 'Активация',
                accessor: (d) => d,
                Cell: (row) => (
                    <button className="btn btn-large btn-default btn-reset"
                        onClick={this.clickActive.bind(this, row.value)} >
                        {row.value.active ?
                            <i className="fas fa-toggle-on"></i> :
                            <i className="fas fa-toggle-off"></i>}
                    </button>
                ),
            },
            {
                id: 'remove',
                Header: 'Удалить',
                accessor: (d) => d,
                Cell: (row) => (
                    <button className="btn btn-large btn-default btn-reset"
                        onClick={this.clickTrash.bind(this, row.value)}>
                        <i className="fas fa-trash-alt"></i>
                    </button>
                ),
            },
        ];

        const data = this.state.categories.filter((item) => {
            return this.state.search ?
                JSON.stringify(item).toLocaleLowerCase().includes(this.state.search.toLocaleLowerCase()) : true;
        });

        return (
            <div className="h100 categories">
                <div className="wrap">
                    {helper.modal(this)}
                    <header className="toolbar toolbar-header">
                        <h1 className="title">Категории</h1>
                        { this.state.settings.buttons.addCategory ?
                            <div className="toolbar-actions flex">
                                <div className="form-group flex">
                                    <label>Имя:</label>
                                    <input className="form-control" placeholder="Имя категории" type="text"
                                        value={this.state._value.name}
                                        onChange={this.handleChangeName} />
                                </div>
                                <div className="form-group flex">
                                    <label>Ссылка:</label>
                                    <input className="form-control" placeholder="Ссылка" type="text"
                                        value={this.state._value.uri}
                                        onChange={this.handleChangeUri} />
                                </div>
                                <input type="submit" className="btn btn-positive pull-right"
                                    onClick={this.handleAdd}
                                    disabled={this.state.loading.active}
                                    value="Добавить"/>
                            </div>
                            : null }
                        { this.state.settings.buttons.importFile ?
                            <div className="toolbar-actions">
                                <form onSubmit={this.handleImportSubmit} className="flex" >
                                    <div className="form-group flex">
                                        <label>Файл:</label>
                                        <input className="form-control" placeholder="Добавить файл" type="file"
                                            onChange={this.handleImportFile} />
                                    </div>
                                    <input type="submit" className="btn btn-positive pull-right btn-m-10"
                                        onClick={this.handleImportSubmit}
                                        disabled={this.state.loading.active}
                                        value="Распарсить"/>
                                </form>
                            </div>
                            : null }
                        <div className="logs">
                            {this.state.loading.current}
                        </div>
                    </header>
                    <div className="categories">
                        { this.state.loading.active ?
                            <Animation key={Math.random()} /> :
                            <ReactTable
                                nextText={'Следующая'}
                                previousText={'Предыдущая'}
                                noDataText={'Нет данных'}
                                filterable={true}
                                data={data}
                                columns={columns}
                            />
                        }
                    </div>
                </div>
                <footer className="toolbar toolbar-footer">
                    <div className="toolbar-actions flex">
                        <div className="save td-btn">
                            <button className="btn btn-positive"
                                onClick={this.handleSave}
                                disabled={this.state.loading.active}>
                                <i className="fas fa-sync-alt"></i>
                                Сохранить/Обновить
                            </button>
                        </div>
                    </div>
                </footer>
            </div>
        );
    };
}

export default CategoriesView;
