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
