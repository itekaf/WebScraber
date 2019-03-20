import React from 'react';
import Loading from './../../Loading';
import Animation from './../../Animation';
import helper from './../helper';
import CategoriesAbstrat from './../models/CategoryAbstract';

class CategoriesView extends React.Component {
    constructor(props) {
        super(props);

        const Category = props && props.category ? props.category : CategoriesAbstrat;
        const crud = props && props.crud ? props.crud : {};
        const categories = crud.get.categories();

        this.state = {
            Category: Category,
            crud: crud,
            _value: new Category(),
            categories: categories ? categories.map((item) => new Category(item)) : [],
            loading: new Loading(),
        };

        this.handleAdd = this.handleAdd.bind(this);
        this.handleSave = this.handleSave.bind(this);

        this.handleChangeUri = this.handleChangeUri.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
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
        console.log(document.querySelectorAll('.nav-group-item'));
        helper.loading.waiting(this);
        const categories = this.state.categories;
        categories.forEach(async (item, index, array) => {
            try {
                this.state.crud.remove.categories({
                    name: item.name,
                    uri: item.uri,
                });
                await item.create();
            } catch (err) {
                item.error = err;
            } finally {
                this.setState({categories: array});
                this.state.crud.set.categories.push(item);
                if (index === this.state.categories.length - 1) {
                    helper.loading.result(this, 'Категории успешно сохранены и обновлены');
                }
            }
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
    render() {
        return (
            <div className="h100 categories">
                <div className="wrap">
                    {helper.modal(this)}
                    <header className="toolbar toolbar-header">
                        <h1 className="title">Категории</h1>
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
                        <div className="logs">
                            {this.state.loading.current}
                        </div>
                    </header>
                    <div className="categories">
                        { this.state.loading.active ?
                            <Animation key={Math.random()} /> :
                            <table>
                                <thead>
                                    <tr>
                                        <td>Ид</td>
                                        <td>Имя</td>
                                        <td>Ссылка</td>
                                        <td>Страниц</td>
                                        <td>Товаров</td>
                                        <td>Ошибка</td>
                                        <td>Активация</td>
                                        <td>Удалить</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.categories.map((item, index) => {
                                        return (
                                            <tr key={index} id={item.id}>
                                                <td key={index + '_id'}>{item.id}</td>
                                                <td key={index + '_name'}>{item.name}</td>
                                                <td key={index + '_uri'}>{item.uri}</td>
                                                <td key={index + '_pages'}>{item.pages}</td>
                                                <td key={index + '_items'}>{item.items.length}</td>
                                                <td key={index + '_error'}>{item.error}</td>
                                                <td key={index + '_active'} className="td-btn">
                                                    <button className="btn btn-large btn-default"
                                                        onClick={this.clickActive.bind(this, item)} >
                                                        {item.active ?
                                                            <i className="fas fa-toggle-on"></i> :
                                                            <i className="fas fa-toggle-off"></i>}
                                                    </button>
                                                </td>
                                                <td key={index + '_delete'} className="td-btn">
                                                    <button className="btn btn-large btn-default"
                                                        onClick={this.clickTrash.bind(this, item)}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
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
