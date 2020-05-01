import { Route, Switch } from 'react-router-dom';
import React from 'react';

import Home from './Home';

/* Views */
import ItemsView from './core/views/Items';
import LoginView from './core/views/Login';
import SettingsView from './core/views/Settings';
import CategoriesView from './core/views/Categories';

/* Bel */

import CrudBel from './www/belbohemia/core/crud';
import ItemBel from './www/belbohemia/models/item';
import CookiesBel from './www/belbohemia/core/cookies';
import SettingsBel from './www/belbohemia/models/settings';
import CategoryBel from './www/belbohemia/models/category';

/* Zproduct */
import CrudZproduct from './www/zproduct/core/crud';
import ItemZproduct from './www/zproduct/models/item';
import SettingsZproduct from './www/zproduct/models/settings';
import CategoryZproduct from './www/zproduct/models/category';

/* TianGroup */
import SettingsTian from './www/tian/models/settings';
import CrudTianGroup from './www/tian/core/crud';
import ItemTianGroup from './www/tian/models/item';
import CategoryTiagGroup from './www/tian/models/category';

/* kreitspb */
import SettingsKreitspb from './www/kreitspb/models/settings';
import CrudKreitspb from './www/kreitspb/core/crud';
import ItemKreitspb from './www/kreitspb/models/item';
import CategoryKreitspb from './www/kreitspb/models/category';

/* nutricia */
import SettingsNutricia from './www/nutricia/models/settings';
import CrudNutricia from './www/nutricia/core/crud';
import ItemNutricia from './www/nutricia/models/item';
import CategoryNutricia from './www/nutricia/models/category';

/* microlife */
import SettingsMicrolife from './www/microlife/models/settings';
import CrudMicrolife from './www/microlife/core/crud';
import ItemMicrolife from './www/microlife/models/item';
import CategoryMicrolife from './www/microlife/models/category';

/* beurer */
import SettingsBeurer from './www/beurer/models/settings';
import CrudBeurer from './www/beurer/core/crud';
import ItemBeurer from './www/beurer/models/item';
import CategoryBeurer from './www/beurer/models/category';

/* vkusmira */
import SettingsVkusmira from './www/vkusmira/models/settings';
import CrudVkusmira from './www/vkusmira/core/crud';
import ItemVkusmira from './www/vkusmira/models/item';
import CategoryVkusmira from './www/vkusmira/models/category';

/* polezzno */
import SettingsPolezzno from './www/polezzno/models/settings';
import CrudPolezzno from './www/polezzno/core/crud';
import ItemPolezzno from './www/polezzno/models/item';
import CategoryPolezzno from './www/polezzno/models/category';

/* 4fresh */
import Settings4fresh from './www/4fresh/models/settings';
import Crud4fresh from './www/4fresh/core/crud';
import Item4fresh from './www/4fresh/models/item';
import Category4fresh from './www/4fresh/models/category';

const Content = () => {
	return (
		<main>
			<Switch>
				<Route exact path='/' component={Home}/>

				/* Belbohemia */
				<Route path='/www/belbohemia/login' render= {
					() => <LoginView crud={CrudBel} cookies={CookiesBel} key="BL"/>
				}/>
				<Route path='/www/belbohemia/items' render={
					() => <ItemsView item={ItemBel} crud={CrudBel} settings={SettingsBel.item} key="BI"/>
				}/>
				<Route path='/www/belbohemia/settings' render={
					() => <SettingsView crud={CrudBel} key="BS"/>
				}/>
				<Route path='/www/belbohemia/categories' render={
					() => <CategoriesView category={CategoryBel} settings={SettingsBel.category} crud={CrudBel} key="BC"/>
				}/>

				/* zproduct */
				<Route path='/www/zproduct/items' render={
					() => <ItemsView item={ItemZproduct} crud={CrudZproduct} settings={SettingsZproduct.item} key="ZI"/>
				}/>
				<Route path='/www/zproduct/settings' render={
					() => <SettingsView crud={CrudZproduct} key="ZS"/>
				}/>
				<Route path='/www/zproduct/categories' render={
					() => <CategoriesView category={CategoryZproduct} settings={SettingsZproduct.category} crud={CrudZproduct} key="ZC"/>
				}/>

				/* Tian */
				<Route path='/www/tian/items' render={
					() => <ItemsView item={ItemTianGroup} crud={CrudTianGroup} settings={SettingsTian.item} key="TI"/>
				}/>
				<Route path='/www/tian/settings' render={
					() => <SettingsView crud={CrudTianGroup} key="TS"/>
				}/>
				<Route path='/www/tian/categories' render={
					() => <CategoriesView
						key="TC"
						crud={CrudTianGroup}
						category={CategoryTiagGroup}
						settings={SettingsTian.category}
					/>
				}/>

				/* Kreitspb */
				<Route path='/www/kreitspb/items' render={
					() => <ItemsView item={ItemKreitspb} crud={CrudKreitspb} settings={SettingsKreitspb.item} key="KI"/>
				}/>
				<Route path='/www/kreitspb/settings' render={
					() => <SettingsView crud={CrudKreitspb} key="KS"/>
				}/>
				<Route path='/www/kreitspb/categories' render={
					() => <CategoriesView
						key="KC"
						crud={CrudKreitspb}
						category={CategoryKreitspb}
						settings={SettingsKreitspb.category}
					/>
				}/>

				/* Nutricia */
				<Route path='/www/nutricia/items' render={
					() => <ItemsView item={ItemNutricia} crud={CrudNutricia} settings={SettingsNutricia.item} key="NI"/>
				}/>
				<Route path='/www/nutricia/settings' render={
					() => <SettingsView crud={CrudNutricia} key="NS"/>
				}/>
				<Route path='/www/nutricia/categories' render={
					() => <CategoriesView
						key="NC"
						crud={CrudNutricia}
						category={CategoryNutricia}
						settings={SettingsNutricia.category}
					/>
				}/>

				/* microlife */
				<Route path='/www/microlife/items' render={
					() => <ItemsView item={ItemMicrolife} crud={CrudMicrolife} settings={SettingsMicrolife.item} key="BEI"/>
				}/>
				<Route path='/www/microlife/settings' render={
					() => <SettingsView crud={CrudMicrolife} key="BES"/>
				}/>
				<Route path='/www/microlife/categories' render={
					() => <CategoriesView
						key="MC"
						crud={CrudMicrolife}
						category={CategoryMicrolife}
						settings={SettingsMicrolife.category}
					/>
				}/>

				/* beurer */
				<Route path='/www/beurer/items' render={
					() => <ItemsView item={ItemBeurer} crud={CrudBeurer} settings={SettingsBeurer.item} key="BEI"/>
				}/>
				<Route path='/www/beurer/settings' render={
					() => <SettingsView crud={CrudBeurer} key="BES"/>
				}/>
				<Route path='/www/beurer/categories' render={
					() => <CategoriesView
						key="MC"
						crud={CrudBeurer}
						category={CategoryBeurer}
						settings={SettingsBeurer.category}
					/>
				}/>

				/* vkusmira */
				<Route path='/www/vkusmira/items' render={
					() => <ItemsView item={ItemVkusmira} crud={CrudVkusmira} settings={SettingsVkusmira.item} key="BEI"/>
				}/>
				<Route path='/www/vkusmira/settings' render={
					() => <SettingsView crud={CrudVkusmira} key="BES"/>
				}/>
				<Route path='/www/vkusmira/categories' render={
					() => <CategoriesView
						key="VM"
						crud={CrudVkusmira}
						category={CategoryVkusmira}
						settings={SettingsVkusmira.category}
					/>
				}/>

				/* polezzno */
				<Route path='/www/polezzno/items' render={
					() => <ItemsView item={ItemPolezzno} crud={CrudPolezzno} settings={SettingsPolezzno.item} key="BEI"/>
				}/>
				<Route path='/www/polezzno/settings' render={
					() => <SettingsView crud={CrudPolezzno} key="BES"/>
				}/>
				<Route path='/www/polezzno/categories' render={
					() => <CategoriesView
						key="PLZ"
						crud={CrudPolezzno}
						category={CategoryPolezzno}
						settings={SettingsPolezzno.category}
					/>
				}/>

				/* 4fresh */
				<Route path='/www/4fresh/items' render={
					() => <ItemsView item={Item4fresh} crud={Crud4fresh} settings={Settings4fresh.item} key="BEI"/>
				}/>
				<Route path='/www/4fresh/settings' render={
					() => <SettingsView crud={Crud4fresh} key="BES"/>
				}/>
				<Route path='/www/4fresh/categories' render={
					() => <CategoriesView
						key="4F"
						crud={Crud4fresh}
						category={Category4fresh}
						settings={Settings4fresh.category}
					/>
				}/>

			</Switch>
		</main>
	);
};

export default Content;
