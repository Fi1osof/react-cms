import React, {Component} from 'react';

import PropTypes from 'prop-types';

import moment from 'moment';

import Page from '../layout'; 

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';

import {Link, browserHistory} from 'react-router';

// import Topic from './Topic';

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';

import SuccessIcon from 'material-ui-icons/Check';
import FailureIcon from 'material-ui-icons/Clear';
import SaveIcon from 'material-ui-icons/Save';
import MoreIcon from 'material-ui-icons/MoreHoriz';

import UserAvatar from 'modules/Site/components/fields/User/avatar';

import Pagination from 'modules/Site/components/pagination';

import User from './User';
import Compred from './Compred';

export default class UsersPage extends Page {


	constructor(props){

		super(props);

		Object.assign(this.state, {
			limit: 10,
			total: 0,
			users: [],
			delegatesOnly: false,
			myOnly: false,
			compredOpen: false,
		});
	}

	// componentDidMount(){

	// 	// const {
	// 	// 	TopicsStore,
	// 	// } = this.context;

	// 	// this.TopicsStoreListener = TopicsStore.getDispatcher().register(payload => {

	// 	// 	this.loadData();

	// 	// });

	// 	this.loadData();

	// 	super.componentDidMount && super.componentDidMount();
	// }


	// componentDidUpdate(prevProps, prevState, prevContext){

	// 	const {
	// 		router,
	// 	} = this.context;


	// 	const {
	// 		location: {
	// 			query,
	// 		},
	// 	} = router;

	// 	const {
	// 		page,
	// 	} = query || {};

	// 	if(page !== this.state.page){
	// 		this.setState({
	// 			page,
	// 		}, () => this.loadData());
	// 	}

	// 	// const {
	// 	// 	router: prevRouter,
	// 	// } = prevContext;

	// 	// if(router && prevRouter){

	// 	// 	const {
	// 	// 		location: {
	// 	// 			query,
	// 	// 		},
	// 	// 	} = router;

	// 	// 	const {
	// 	// 		location: {
	// 	// 			query: prevQuery,
	// 	// 		},
	// 	// 	} = prevRouter;

	// 	// 	if(query && prevQuery){

	// 	// 		const {
	// 	// 			page,
	// 	// 		} = query;

	// 	// 	}

	// 	// }

	// 	super.componentDidUpdate && super.componentDidUpdate(prevProps, prevState, prevContext);
	// }
	

	loadData(){
 

		const {
			delegatesOnly,
			myOnly,
		} = this.state;

		const page = this.getPage();

		return super.loadData({
			page,
			delegatesOnly,
			myOnly,
		});
		
	}

  async loadServerData(provider, options = {}){


    // let {
    //   cities: citiesNull,
    //   ...debugOptions
    // } = options;
    // console.log("UsersPage loadServerData options", debugOptions);

		// const {
		// 	localQuery,
		// } = this.context;

		const {
			page,
			delegatesOnly,
			myOnly,
		} = options;

		const result = await provider({
			operationName: "Users",
			variables: {
				limit: 10,
				usersPage: page,
				withPagination: true,
				userGetComments: true,
				getImageFormats: true,
				usersDelegatesOnly: delegatesOnly,
				usersMyOnly: myOnly,
				// resourcesLimit: 10,
				// resourceGetAuthor: true,
				// resourceGetComments: true,
				// getCommentAuthor: true,
			},
		})
		.then(r => {

			// console.log("UsersPage result", r);

			// const {
			// 	usersList,
			// } = r.data;

			// const {
			// 	count,
			// 	total,
			// 	object: users,
			// } = usersList || {};

			// this.setState({
			// 	users,
			// 	total,
			// });

			return r;

		})
		.catch(e => {
			// console.error(e);
			throw(e);
		}); 


	  if(result && result.data){

	  	let title;

	  	title = title || "Список пользователей";

	  	if(page > 1){

	  		title = `${title}, страница ${page}`;

	  	}

  		Object.assign(result.data, {
  			title,
  		});

	  }
	  else{
	  	return null;
	  }


		return result;
		
	}


	// renderTopics(){

	// 	const {
	// 		users,
	// 		limit,
	// 	} = this.state;



	// 	let topicsList = [];

	// 	topics && topics.map((topic, index) => {

	// 		if(limit > 0 && topicsList.length >= limit){
	// 			return;
	// 		}

	// 		const {
	// 			id,
	// 			name,
	// 		} = topic;

	// 		topicsList.push(<Topic
	// 			key={id}
	// 			item={topic}
	// 			open={false}
	// 			commentOpen={false}
	// 		>
	// 			{name}
	// 		</Topic>);

	// 	});

	// 	let moreButton;

	// 	if(topicsList && topics && topicsList.length < topics.length){

	// 		moreButton = <div
	// 			style={{
	// 				textAlign: "center",
	// 			}}
	// 		>
				
	// 			<Button
	// 				onClick={event => {

	// 					this.setState({
	// 						limit: limit + 10,
	// 					});

	// 				}}
	// 				raised
	// 			>
	// 				Показать еще
	// 			</Button>

	// 		</div>

	// 	}

	// 	return <div>
	// 		{topicsList}

	// 		{moreButton}
	// 	</div>

	// }

	onDelegatedChange = (event, checked) => {



		this.setState({
			delegatesOnly: checked,
		}, () => {
			this.reloadData();
		});

	}

	onMyOnlyChange = (event, checked) => {



		this.setState({
			myOnly: checked,
		}, () => {
			this.reloadData();
		});

	}
	
	// renderUser(username){

	// 	return <User 
	// 		username={username}
	// 	/>;

	// }
	
	// renderAction(action){

	// 	switch(action){

	// 		case 'add-topic':

	// 			return <AddTopic
	// 			/>;

	// 			break;

	// 		default: return null;
	// 	}

	// }

	updateUser(user, data){

		const {
			updateItem,
			UsersStore,
		} = this.context;

		const {
			id,
		} = user;

		if(!id){
			return;
		}

		const storeUser = UsersStore.getState().find(n => n.id === id);

		if(storeUser){

			updateItem(storeUser, data, UsersStore);

		}

	}

	saveItem(user){



		const {
			saveItem,
			UsersStore,
		} = this.context;

		const {
			id,
		} = user;

		if(!id){
			return;
		}

		const storeUser = UsersStore.getState().find(n => n.id === id);

		if(storeUser){

			saveItem(UsersStore, storeUser, "crm/users/");

		}

	}


	onUpdateField = (event, user) => {

		const {
			name,
			value,
		} = event.target;

		let data = {};



		data[name] = value;

		switch(name){

			case 'offer_date':
			case 'contract_date':

				data[name] = new Date(value).getTime() / 1000;

				break;

		}




		this.updateUser(user, data); 

	}


	renderUsers(){


		const {
			params,
		} = this.props;

		const {
			user: currentUser,
			updateItem,
		} = this.context;

		const {
			usersList,
			delegatesOnly,
			myOnly,
			compredOpen,
		} = this.state;

		// if(!usersList){
		// 	return null;
		// }

		const {
			page,
			limit,
			total,
			object: users,
		} = usersList || {};

		let content;

		let rows = [];

		const hasCRMPerm = currentUser.hasPermission("CRM");

		users && users.map(user => {

			const {
				id,
				username,
				fullname,
				email,
				comments,
				createdby,
				createdon,
				delegate,
				offer_date,
				contract_date,
				active,
				offer,
				_Dirty,
			} = user;



			let columns = [

				<TableCell
					key="user"
				>

					<Grid
						container
      			gutter={0}
						align="center"
						style={{
							flexWrap: "nowrap",
						}}
					>
						
						{_Dirty ? 
							<IconButton 
								onClick={() => {
									this.saveItem(user);
								}}
							>
								<SaveIcon 
									color="red"
								/>
							</IconButton>
						 : ""}

		        <UserAvatar 
		        	user={user}
		        	style={{
		        		marginRight: 10,
		        	}}
		        />
						
						<Link
							to={`/profile/${username}`}
							href={`/profile/${username}`}
						>
							{fullname || username}
						</Link>

					</Grid>

				</TableCell>,

				<TableCell
					key="username"
				>
					{createdon && moment(createdon * 1000).format("YYYY-MM-DD") || ""}
				</TableCell>,

				<TableCell
					key="comments"
				>
					{comments && comments.length || ""}
				</TableCell>,
				
				<TableCell
					key="email"
				>
					{email || "Нет прав на просмотр"}
				</TableCell>,
			];

			if(hasCRMPerm){

				columns.unshift(<TableCell
					key="actions"
				>
					
					<Link
						to={`/profile/${username}`}
						href={`/profile/${username}`}
					>
						<Button
							fab
							style={{
								height: 30,
								width: 30,
							}}
						>
							<MoreIcon
							/>
						</Button>
					</Link>

				</TableCell>)

				columns.push(<TableCell
					key="manager"
				>
					{createdby || ""}
				</TableCell>)


				columns.push(<TableCell
					key="isActive"
				>
					{active === true ? <SuccessIcon color="green"/> : active === false ? <FailureIcon color="red"/> : ""}
				</TableCell>)

				columns.push(<TableCell
					key="delegate"
				>
					{delegate === true ? <SuccessIcon color="green"/> : delegate === false ? <FailureIcon color="red"/> : ""}
				</TableCell>)

				columns.push(<TableCell
					key="offerDate"
				>

					<TextField
						type="date"
						name="offer_date"
						value={offer_date && moment(offer_date * 1000).format("YYYY-MM-DD") || ""}
						onChange={event => this.onUpdateField(event, user)}
					/>

				</TableCell>)

				columns.push(<TableCell
					key="contract"
				>

					<TextField
						type="date"
						name="contract_date"
						value={contract_date && moment(contract_date * 1000).format("YYYY-MM-DD") || ""}
						onChange={event => this.onUpdateField(event, user)}
					/>

				</TableCell>)

				columns.push(<TableCell
					key="offter"
				>

					{/*offer && <div dangerouslySetInnerHTML={{__html: offer}}></div> || ""*/}
					{offer && <Button >Показать текст</Button>|| ""}

				</TableCell>)

			}

			rows.push(<TableRow
				key={id}
			>

				{columns}

			</TableRow>);

		});

		// if(!rows || !rows.length){
		// 	return null;
		// }



		let columns = [
			<TableCell
				key="user"
			>
				Пользователь
			</TableCell>,
			
			<TableCell
				key="createdon"
			>
				Дата регистрации
			</TableCell>,
			
			<TableCell
				key="comment"
			>
				Комментарии
			</TableCell>,
			
			<TableCell
				key="email"
			>
				Емейл
			</TableCell>,
		];

		if(hasCRMPerm){

			columns.unshift(<TableCell
				key="actions"
			>
				Действия
			</TableCell>);

			columns.push(<TableCell
				key="manager"
			>
				Менеджер
			</TableCell>);

			columns.push(<TableCell
				key="isActive"
			>
				Активен
			</TableCell>);

			columns.push(<TableCell
				key="delegate"
			>
				Представитель
			</TableCell>);

			columns.push(<TableCell
				key="offer_date"
			>
				Дата предложения
			</TableCell>);


			columns.push(<TableCell
				key="contract"
			>
				Сделка
			</TableCell>);

			columns.push(<TableCell
				key="offer"
			>
				Предложение
			</TableCell>);
		}

		return <div
			style={{
				width: "100%",
			}}
		>

			{hasCRMPerm 
				?
					<Paper
						style={{
							width: "100%",
							margin: "30px 0",
						}}
					>

						<Grid
							container
							align="center"
							gutter={0}
						>
							
							<Checkbox
								checked={delegatesOnly}
								onChange={this.onDelegatedChange}
							/>	Только представители
							
							<Checkbox
								checked={myOnly}
								onChange={this.onMyOnlyChange}
							/>	Только мои

							<Button 
								onClick={event => {
									this.setState({
										compredOpen: true,
									});
								}}
							>
								Добавить контакт
							</Button>

							{compredOpen 
								?
								<Compred 
								/>
								:
								null
							}

						</Grid>

					</Paper>
				:
				null
			
			}

			<Paper
				style={{
					overflow: "auto",
					width: "100%",
					margin: "30px 0",
				}}
			>
				
				<Table>
						
					<TableHead>
						
						<TableRow>

							{columns}

						</TableRow>

					</TableHead>

					<TableBody>

						{rows}
						
					</TableBody>


				</Table>
				

			</Paper>

	    <div
	    	style={{
	    		textAlign: "center",
	    	}}
	    >
	    	
	    	<Pagination
	      	page={parseInt(page) || 1}
		      limit={limit}
		      total={total}
		    />

	    </div>

		</div>

	}

	render(){

		let {
			params,
		} = this.props;

		let {
			action,
			username,
		} = params || {};

		let content;

		// if(action){
			
		// 	content = this.renderAction(action);

		// }
		// else 
		
		// if(username){
			
		// 	content = this.renderUser(username);

		// }
		// else{

		// 	content = this.renderUsers();

		// }

		content = this.renderUsers();



		return super.render(<div
			style={{
				width: "100%",
			}}
		>
 			
 			{content}


		</div>);
	}

}

