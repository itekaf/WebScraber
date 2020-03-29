import React from 'react';
import {Link} from 'react-router-dom';

const Sidebar = () => {
	const menu = [
		{
			name: 'Belbohemia.by',
			items: [
				{
					name: 'Авторизация',
					icon: 'fas fa-sign-in-alt',
					uri: '/www/belbohemia/login',
				},
				{
					name: 'Категории',
					icon: 'fas fa-layer-group',
					uri: '/www/belbohemia/categories',
				},
				{
					name: 'Товары',
					icon: 'far fa-list-alt',
					uri: '/www/belbohemia/items',
				},
				{
					name: 'Настройки',
					icon: 'fas fa-cogs',
					uri: '/www/belbohemia/settings',
				},
			],
		},
		{
			name: 'Zproduct.by',
			items: [
				{
					name: 'Категории',
					icon: 'fas fa-layer-group',
					uri: '/www/zproduct/categories',
				},
				{
					name: 'Товары',
					icon: 'far fa-list-alt',
					uri: '/www/zproduct/items',
				},
				{
					name: 'Настройки',
					icon: 'fas fa-cogs',
					uri: '/www/zproduct/settings',
				},
			],
		},
		{
			name: 'Tian.by',
			items: [
				{
					name: 'Категории',
					icon: 'fas fa-layer-group',
					uri: '/www/tian/categories',
				},
				{
					name: 'Товары',
					icon: 'far fa-list-alt',
					uri: '/www/tian/items',
				},
				{
					name: 'Настройки',
					icon: 'fas fa-cogs',
					uri: '/www/tian/settings',
				},
			],
		},
		{
			name: 'Kreitspb.ru',
			items: [
				{
					name: 'Категории',
					icon: 'fas fa-layer-group',
					uri: '/www/kreitspb/categories',
				},
				{
					name: 'Товары',
					icon: 'far fa-list-alt',
					uri: '/www/kreitspb/items',
				},
				{
					name: 'Настройки',
					icon: 'fas fa-cogs',
					uri: '/www/kreitspb/settings',
				},
			],
		},
		{
			name: 'nutricia-medical.ru',
			items: [
				{
					name: 'Категории',
					icon: 'fas fa-layer-group',
					uri: '/www/nutricia/categories',
				},
				{
					name: 'Товары',
					icon: 'far fa-list-alt',
					uri: '/www/nutricia/items',
				},
				{
					name: 'Настройки',
					icon: 'fas fa-cogs',
					uri: '/www/nutricia/settings',
				},
			],
		},
		{
			name: 'microlife.by',
			items: [
				{
					name: 'Категории',
					icon: 'fas fa-layer-group',
					uri: '/www/microlife/categories',
				},
				{
					name: 'Товары',
					icon: 'far fa-list-alt',
					uri: '/www/microlife/items',
				},
				{
					name: 'Настройки',
					icon: 'fas fa-cogs',
					uri: '/www/microlife/settings',
				},
			],
		},
		{
			name: 'beurer-belarus.by',
			items: [
				{
					name: 'Категории',
					icon: 'fas fa-layer-group',
					uri: '/www/beurer/categories',
				},
				{
					name: 'Товары',
					icon: 'far fa-list-alt',
					uri: '/www/beurer/items',
				},
				{
					name: 'Настройки',
					icon: 'fas fa-cogs',
					uri: '/www/beurer/settings',
				},
			],
		},
		{
			name: 'vkusmira',
			items: [
				{
					name: 'Категории',
					icon: 'fas fa-layer-group',
					uri: '/www/vkusmira/categories',
				},
				{
					name: 'Товары',
					icon: 'far fa-list-alt',
					uri: '/www/vkusmira/items',
				},
				{
					name: 'Настройки',
					icon: 'fas fa-cogs',
					uri: '/www/vkusmira/settings',
				},
			],
		},
		{
			name: 'polezzno',
			items: [
				{
					name: 'Категории',
					icon: 'fas fa-layer-group',
					uri: '/www/polezzno/categories',
				},
				{
					name: 'Товары',
					icon: 'far fa-list-alt',
					uri: '/www/polezzno/items',
				},
				{
					name: 'Настройки',
					icon: 'fas fa-cogs',
					uri: '/www/polezzno/settings',
				},
			],
		},
		{
			name: '4fresh',
			items: [
				{
					name: 'Категории',
					icon: 'fas fa-layer-group',
					uri: '/www/4fresh/categories',
				},
				{
					name: 'Товары',
					icon: 'far fa-list-alt',
					uri: '/www/4fresh/items',
				},
				{
					name: 'Настройки',
					icon: 'fas fa-cogs',
					uri: '/www/4fresh/settings',
				},
			],
		},
	];
	return (
		<nav className="nav-group">
			{menu.map((item) => {
				const title = <h4 className="nav-group-title" key={item.name}>{item.name}</h4>;
				const items = item.items.map((subNav, index) => {
					return (<div className="nav-group-item" key={`${item.name}_${index}`}>
						<Link to={subNav.uri}>
							<i className={subNav.icon}></i>
							{subNav.name}
						</Link>
					</div>);
				});
				return [].concat(title, items);
			})}
		</nav>
	);
};

export default Sidebar;
