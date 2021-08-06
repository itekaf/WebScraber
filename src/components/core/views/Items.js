import React from 'react';
import Loading from './../../Loading';
import Animation from './../../Animation';
import ReactTable from 'react-table';
import ItemAbstract from './../models/ItemAbstract';

import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import json2xls from 'json2xls';
import helper from './../helper';
import downloadHelper from './../../utils/download';

class ItemsView extends React.Component {
	constructor(props) {
		super(props);

		const Item = props && props.item ? props.item : ItemAbstract;
		const crud = props && props.crud ? props.crud : {};
		const settings = props && props.settings ? props.settings : {};
		const categories = crud.get.categories();

		this.state = {
			Item: Item,
			crud: crud,
			categories: categories || [],
			loading: new Loading(),
			settings: settings,
		};

		this.handleParse = this.handleParse.bind(this);
		this.handleExport = this.handleExport.bind(this);
		this.handleDowloadImages = this.handleDowloadImages.bind(this);
	}

	concatItems(categories = this.state.categories) {
		return categories.reduce((acum, item) => {
			return acum.concat(item.items);
		}, []);
	}
	handleExport() {
		const xls = json2xls(this.concatItems());
		const tempFolder = this.state.crud.get.main.settings().tempFolder;
		helper.mkDir(tempFolder);

		const filePath = path.join(tempFolder, `items-${Date.now()}.xlsx`);
		fs.writeFileSync(filePath, xls, 'binary');
		exec(filePath, (error) => console.log(error));
	}

	handleParse() {
		const categories = this.state.categories.filter((x) => x.active);
		const counter = this.concatItems(categories).length;
		const settings = this.state.crud.get.main.settings();

		helper.loading.waiting(this, 'Начали', counter);

		categories.forEach((category, index) => {
			// TODO: рефактор
			const tasks = [];
			const items = [];
			category.items.forEach((item, i) => {
				const temp = new this.state.Item(item);
				const speed = index * (settings.speed / 2) + i * (settings.speed / 2);
				tasks.push(temp.getItem(speed, this));
				items.push(temp);
			});
			Promise.all(tasks)
				.then(() => {
					const categories = this.state.crud.get.categories()
						.map((cat) => {
							if (cat.id === category.id) {
								const newItems = items.reduce((acum, item) => {
									if (item.possibleSizes && item.possibleSizes.length !== 0) {
										item.possibleSizes.forEach((size) => {
											const sizeItem = Object.assign({}, item);
											sizeItem.size = size;

											if (sizeItem.possibleColors && sizeItem.possibleColors.length !== 0) {
												sizeItem.possibleColors.forEach((color) => {
													const colorItem = Object.assign({}, sizeItem);
													colorItem.color = color;
													acum.push(colorItem);
												});
											} else {
												acum.push(sizeItem);
											}
										});
									} else {
										acum.push(item);
									}
									return acum;
								}, []);
								cat.items = newItems;
							}
							return cat;
						});
					this.state.crud.set.categories.set(categories);
					this.setState({ categories: categories });
					if (this.state.loading.counter === 0) {
						helper.loading.result(this, 'Парсинг успешно закончен');
					}
				})
				.catch((err) => {
					helper.loading.result(this, err.message, false);
					console.log(err);
				});
		});
	}

	handleDowloadImages() {
		const tasks = [];
		const items = this.concatItems(this.state.categories.filter((x) => x.active));
		const settings = this.state.crud.get.main.settings();

		let currentItemId = settings.ImgStartId;

		helper.loading.waiting(this, 'Загружаем картинки', items.length);
		helper.mkDir(settings.imageFolder);

		items.forEach((item, itemIndex) => {
			if (item.image) {
				// TODO: RL: Refactor this shit
				if (Array.isArray(item.image)) {
					item.image.forEach((uri, imageIndex) => {
						const promise = downloadHelper.image(uri, imageIndex, itemIndex, settings, item, this, currentItemId);
						tasks.push(promise);
					});
				} else {
					const promise = downloadHelper.image(item.image, 0, itemIndex, settings, item, this, currentItemId);
					tasks.push(promise);
				}
			}
			currentItemId++;
		});
		Promise.all(tasks)
			.then(() => {
				helper.loading.result(this, 'Картинки успешно скачаны');
			})
			.catch((err) => {
				helper.loading.result(this, err.message, false);
				console.log(err);
			});
	}

	render() {
		const data = this.concatItems().filter((item) => {
			return this.state.search ?
				JSON.stringify(item).toLocaleLowerCase().includes(this.state.search.toLocaleLowerCase()) : true;
		});
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
				id: 'disc',
				Header: 'Описание',
				accessor: (d) => d.description,
			},
			{
				id: 'appCategory',
				Header: 'Категория',
				accessor: (d) => d.appCategory,
			},
			{
				id: 'price',
				Header: 'Цена',
				accessor: (d) => d.price,
			},
			{
				id: 'sells',
				Header: 'Скидочная цена',
				accessor: (d) => d.sells,
			},
			{
				id: 'err',
				Header: 'Ошибка',
				accessor: (d) => d.error,
			},
			{
				id: 'uri',
				Header: 'Ссылка',
				accessor: (d) => d.uri,
			},
		];

		return (
			<div className="items">
				<div className="wrap">
					{helper.modal(this)}
					<header className="toolbar toolbar-header">
						<h1 className="title">Категории</h1>
						<div className="toolbar-actions flex">
							<div className="save td-btn">
								<button className="btn btn-default"
									onClick={this.handleParse}
									disabled={this.state.loading.active}
								>
									<i className="fas fa-database" />
                                    Распарсить
								</button>
								<button className="btn btn-default"
									onClick={this.handleExport}
									disabled={this.state.loading.active}
								>
									<i className="fas fa-file-export" />
                                    Экспорт
								</button>
								<button className="btn btn-default"
									onClick={this.handleDowloadImages}
									disabled={this.state.loading.active}
								>
									<i className="fas fa-images" />
                                    Скачать картинки
								</button>
							</div>
						</div>
						<div className="logs">
							{this.state.loading.active
								? 'Осталось: ' + this.state.loading.counter + ' Cейчас: ' + this.state.loading.current
								: ''}
						</div>
					</header>
					<div className="content">
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
			</div>
		);
	}
}

export default ItemsView;
