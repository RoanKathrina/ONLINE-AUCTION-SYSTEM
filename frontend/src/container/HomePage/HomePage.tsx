import axios from 'axios';
import React, { Component } from 'react';
import classes from './HomePage.module.css'
import { Link } from 'react-router-dom';
import ModalPage from "../../component/ModalPage/ModalPage";

class HomePage extends React.Component<any, any>{

    interval: any;
    user: any;
    email: any;
    emailPass: any;
    newItemName: any = '';
    newStartPrice: any = '';
    newTimeWindow: any = '';
    depositAmount: any = '';
    isUserLoggedIn: any = false;
    constructor(props: any) {
        super(props);        
        this.state = {
            completedBid: null,
            ongoingBid: null,
            completedBidFlag: true,
            ongoingBidFlag: false,
            show: false,
            id: null,
            itemName: null,
            currentPrice: null,
            bidPrice: null,
            isLoading: true,
            openCreateNewItemModal: false,
            openDepositModal: false
        }

        this.user = localStorage.getItem('user');
        this.email = JSON.parse(this.user).email;
        this.emailPass = JSON.parse(this.user).emailPass;
        this.isUserLoggedIn = JSON.parse(this.user).isUserLoggedIn;
        console.log('[DEBUGGING] LOCAL STORAGE');
        console.log(this.user);
    }

    openCreateNewItemModal = () => {
        this.setState({openCreateNewItemModal: true});
    }

    closeCreateNewItemModal = () => {
        this.setState({openCreateNewItemModal: false});
    }

    clearCreateNewItemModal = () => {
        this.newItemName = '';
        this.newStartPrice = '';
        this.newTimeWindow = '';
    }

    openDepositModal = () => {
        this.setState({openDepositModal: true});
    }

    closeDepositModal = () => {
        this.setState({openDepositModal: false});
    }

    clearDepositModal = () => {
        this.depositAmount = '';
    }

    logoutUser = () => {
        localStorage.setItem('user', JSON.stringify({
            email: '',
            credit: '',
			emailPass: '',
            isUserLoggedIn: false
        }));
		this.props.history.push('/login');
    }

    newItemNameHandler = (event: any) => {
        this.newItemName = event.target.value;
    }

    startPriceHandler = (event: any) => {
        this.newStartPrice = event.target.value;
    }

    timeWindowHandler = (event: any) => {
        this.newTimeWindow = event.target.value;
    }

    depositInputHandler = (event: any) => {
        this.depositAmount = event.target.value;
    }

    redirectLogin = () => {
		this.props.history.push('/login');
    }

    deposit = () => {
        if(this.depositAmount === ''){
			window.alert('Provide a valid Deposit Amount');
			return;
        }

        const amountReg = /^[0-9]+$/;
		if(amountReg.test(this.depositAmount) === false){
			window.alert('Allowed Deposit Amount are decimals (i.e. 10, 200, 1000)');
			return;
		}

        if(parseInt(this.depositAmount) === 0){
            window.alert('Deposit Amount SHOULD be bigger than PHP 0');
            return;
        }

        console.log("[DEBUGGING]: /api/deposit/update: " + "http://localhost:8086/api/deposit/update?user=" + this.emailPass + "&deposit=" + this.depositAmount);

        axios.put("http://localhost:8086/api/deposit/update?user=" + this.emailPass + "&deposit=" + this.depositAmount).then(response => {
            console.log('[DEBUGGING] /api/create-item');
            console.log(response);
            if(response.data.exit_code !== '200'){
                window.alert(response.data.exit_message.msg);
                return
            }
            else {
                window.alert("You have successfully deposited DEPOSIT AMOUNT: " + this.depositAmount + " for USER: " + this.email);        
            }
        }).finally(() => {
            this.closeDepositModal();
            this.clearDepositModal();
        })        
    }

    addNewItem = () => {

        if(this.newItemName === ''){
			window.alert('Provide a valid Item Name');
			return;
        }

		const newItemReg = /^[a-zA-Z0-9]+$/;
		if(newItemReg.test(this.newItemName) === false){
			window.alert('Item Name should be in alphanumeric values only');
			return;
		}

        if(this.newStartPrice === ''){
			window.alert('Provide a valid Start Price. Start Price should be MORE than PHP 0');
			return;
        }

        if(parseInt(this.newStartPrice) <= 0){
            window.alert('Start Price should be MORE than PHP 0');
            return;
        }

		const newStartPriceReg = /^[0-9]+$/;
		if(newStartPriceReg.test(this.newStartPrice) === false){
			window.alert('Start Price amount SHOULD be in whole numbers only (i.e. 10, 200, 1000)');
			return;
		}

        if(this.newTimeWindow === ''){
			window.alert('Provide a valid Time Window. Time Window should be in HH:MM:SS format');
			return;
        }

        const newTimeWindowReg = /^(:?(:?([0-9]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
		if(newTimeWindowReg.test(this.newTimeWindow) === false){
			window.alert('Time Window should be in HH:MM:SS format');
			return;
		}

        if(this.newTimeWindow === '00:00:00'){ 
			window.alert('Time Window cannot be set to 00:00:00');
			return;
        }

        var newTimeWindowList = this.newTimeWindow.split(':');
        if(newTimeWindowList[0] === '00' && newTimeWindowList[1] === '00' && parseInt(newTimeWindowList[2]) <= 59){ 
			window.alert('Time Window cannot be less than 1 minute');
			return;
        }

        console.log("[DEBUGGING]: " + "http://localhost:8086/api/create-item/?item_name="+ this.newItemName + "&start_price=" + this.newStartPrice + "&time_window=" + this.newTimeWindow)
        axios.put("http://localhost:8086/api/create-item/item?item_name="+ this.newItemName + "&start_price=" + this.newStartPrice + "&time_window=" + this.newTimeWindow).then(response => {
            console.log('[DEBUGGING] /api/create-item');
            console.log(response);
            if(response.data.exit_code !== '200'){
                window.alert(response.data.exit_message);
                return
            }
            else {
                window.alert("You have successfully created a new item on \nNEW ITEM NAME: " + this.newItemName + "\nSTART PRICE: " 
                + this.newStartPrice + "\nTIME WINDOW: " + this.newTimeWindow);        
            }
        }).finally(() => {
            this.closeCreateNewItemModal();
            this.clearCreateNewItemModal();
            this.updateOngoingTab();
            this.updateCompletedTab();    
        })
    }


    bidItem = () => {

        if(this.state.bidPrice === ''){
			window.alert('Provide a valid bid amount');
			return;
        }

        const amountReg = /^[0-9]+$/;
		if(amountReg.test(this.state.bidPrice) === false){
			window.alert('Allowed bid amount are decimals (i.e. 10, 200, 1000)');
			return;
		}

        if(parseInt(this.state.bidPrice) <= parseInt(this.state.currentPrice)){
            window.alert('Bid amount SHOULD be bigger than current price');
            return;
        }

        axios.get("http://localhost:8086/api/render-home/bid-item?email="+ this.email + "&item_id=" + this.state.id + "&bid_price=" + this.state.bidPrice).then(response => {
            console.log('[DEBUGGING] /api/render-home/bid-item');
            console.log(response);
            if(response.data.exit_code !== '200'){
                window.alert(response.data.exit_message);
                return
            }
            else {
                this.setState({currentPrice: this.state.bidPrice});
                window.alert("You have successfully bid on \nITEM: " + this.state.itemName + "\nID: " 
                            + this.state.id + "\nCURRENT PRICE: " + this.state.bidPrice);   
            }
        }).finally(() => {
            this.hideModal();
            this.updateOngoingTab();
            this.updateCompletedTab();
        })
    }

    bidPriceInputHandler = (event: any) => {       
        this.setState({bidPrice: event.target.value});
    }

    setCompletedViewMode = (event: any) => {
        event.preventDefault();
        this.updateCompletedTab();
        this.setState({completedBidFlag: true});
        this.setState({ongoingBidFlag: false});
    }

    setOngoingViewMode = (event: any) => {
        event.preventDefault();
        this.updateOngoingTab();
        this.setState({completedBidFlag: false});
        this.setState({ongoingBidFlag: true});
    }

    showModal = (ongoingBidItem: any) => {
        this.setState({
            show: true, 
            id: ongoingBidItem.id,
            itemName: ongoingBidItem.item_name.toUpperCase(),
            currentPrice: ongoingBidItem.current_price
        })
    }

    hideModal = () => {
        this.setState({show: false})
    }

	componentDidMount = () => {
        console.log("[DEBUGGING] componentDidMount")
		axios.get('http://localhost:8086/api/render-home/ongoing-bid-items').then(response => {
            console.log('[DEBUGGING] /api/render-home/ongoing-bid-items');
            console.log(response);
            if(response.data.exit_code !== '200'){
                console.log('[LOGGING] componentDidMount: ' + response.data.exit_message);
                return;
            }
            else {
                this.setState({ongoingBid: response.data.result, isLoading: false});
            }
		});

		axios.get('http://localhost:8086/api/render-home/completed-bid-items').then(response => {
            console.log('[DEBUGGING] /api/render-home/completed-bid-items');
            console.log(response);
            if(response.data.exit_code !== '200'){
                console.log('[LOGGING] componentDidMount: ' + response.data.exit_message);
                return
            }
            else {
                this.setState({completedBid: response.data.result, isLoading: false});
            }
		})
		this.forceUpdate();
    };

    updateOngoingTab = () => {
        axios.get('http://localhost:8086/api/render-home/ongoing-bid-items').then(response => {
            console.log('[DEBUGGING] /api/render-home/ongoing-bid-items');
            if(response.data.exit_code !== '200'){
                window.alert(response.data.exit_message);
                return;
            }
            else {
                this.setState({ongoingBid: response.data.result, isLoading: false});
            }
		})
    }

    updateCompletedTab = () => {
		axios.get('http://localhost:8086/api/render-home/completed-bid-items').then(response => {
            console.log('[DEBUGGING] /api/render-home/completed-bid-items');
            console.log(response);
            if(response.data.exit_code !== '200'){
                window.alert(response.data.exit_message);
                return;
            }
            else {
                this.setState({completedBid: response.data.result, isLoading: false});
            }
		})
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }    

	render() {

        if(this.isUserLoggedIn === false) {
            this.redirectLogin();
        }

        if(this.state.isLoading === true) {
            return <div className={classes.HomePageLoading}>Loading...</div>;
        }

		var ongoing_bid_items = [], i = 0;
		if (this.state.ongoingBid !== null) {
			for (i=0; i<this.state.ongoingBid.length; i++){
				ongoing_bid_items.push(
                    <div className={classes.AuctionItem} key={this.state.ongoingBid[i].id}>
                        <img src='https://www.shutterstock.com/image-vector/auction-label-red-band-sign-260nw-1514047166.jpg' style={{height: '200px'}}/>
                        <h1>{this.state.ongoingBid[i].item_name.toUpperCase()}</h1>
                        <h3>ID: {this.state.ongoingBid[i].id}</h3>
                        <h2>CURRENT PRICE: PHP {this.state.ongoingBid[i].current_price}</h2>
                        <h2>AUCTION END: {this.state.ongoingBid[i].end_date} {this.state.ongoingBid[i].end_time}</h2>
                        <button className={classes.BidButton} onClick={this.showModal.bind(this, this.state.ongoingBid[i])}>BID</button>
                        <ModalPage 
                            show={this.state.show}>
                            <img src='https://www.shutterstock.com/image-vector/auction-label-red-band-sign-260nw-1514047166.jpg' style={{height: '250px'}}/>
                            <h1>{this.state.itemName}</h1>
                            <h2>ID: {this.state.id}</h2>
                            <h2>CURRENT PRICE: PHP {this.state.currentPrice}</h2>
                            <input className={classes.BidInputBox} onChange={this.bidPriceInputHandler}></input>
                            <div className={classes.BidButtonDiv}>
                                <button type="button" className={classes.BidButton} onClick={this.hideModal}>Cancel</button>
                                <button type="button" className={classes.BidButton} onClick={this.bidItem}>Submit</button>
                            </div>
                        </ModalPage>
                </div>
                );
			}
		}

		var completed_bid_items = [], i = 0;
		if (this.state.completedBid !== null) {
			for (i=0; i<this.state.completedBid.length; i++){
				completed_bid_items.push(
                    <div className={classes.AuctionItem} key={this.state.completedBid[i].id}>
                        <img src='https://www.shutterstock.com/image-vector/auction-label-red-band-sign-260nw-1514047166.jpg' style={{height: '200px'}}/>
                        <h1>{this.state.completedBid[i].item_name.toUpperCase()}</h1>
                        <h3>ID: {this.state.completedBid[i].id}</h3>
                        <h2>START PRICE: {this.state.completedBid[i].start_price}</h2>
                        <h2>FINAL PRICE: PHP {this.state.completedBid[i].current_price}</h2>
                    </div>
                );
			}
		}

        return(
        <div className={classes.HomePage}>
            <div className={classes.Container}>
                <img src='https://www.pinclipart.com/picdir/big/404-4045342_customers-for-your-business-animated-people-transparent-background.png' className={classes.HeaderImage}/>
                <p className={classes.HeaderText}>ONLINE AUCTION SYSTEM</p>

                <div className={classes.HeaderMenu}>
                    <div>
                        <button className={classes.HeaderMenuSelection} onClick={() => this.openCreateNewItemModal()}><b>ADD NEW ITEM</b></button>
                    </div>
                    <div>
                        <button className={classes.HeaderMenuSelection} onClick={() => this.openDepositModal()}><b>DEPOSIT</b></button>
                    </div>
                    <div>
                        <button className={classes.HeaderMenuSelection} onClick={() => this.logoutUser()}><b>LOGOUT</b></button>
                    </div>
                    <div>
                        <button className={classes.HeaderMenuUser} disabled={true}><b>{this.email}</b></button>
                    </div>
                </div>
            </div>

            <div className={classes.OngoingCompletedSelector}>
                <button className={classes.OngoingCompletedSelectorButton} onClick={this.setCompletedViewMode} disabled={this.state.completedBidFlag}><b>COMPLETED BID</b></button>
                <button className={classes.OngoingCompletedSelectorButton} onClick={this.setOngoingViewMode} disabled={this.state.ongoingBidFlag}><b>ONGOING BID</b></button>
            </div>
            <div className={classes.OngoingCompletedPageDiv}>
                {this.state.completedBidFlag ? 
                    <div className={classes.OngoingCompletedPageDivProducts}>
                        <h1>Showing Completed Bid Items</h1>
                        {completed_bid_items}
                    </div>
                    :
                    <div className={classes.OngoingCompletedPageDivProducts}>
                        <h1>Showing Ongoing Bid Items</h1>
                        {ongoing_bid_items}
                    </div>
                }
            </div>
            <ModalPage
                show={this.state.openCreateNewItemModal}>
                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRHDNkuHUyU4qNd9qlU5t--eJF4mbg4Kl5WKG9Ng0&s' style={{height: '250px'}}/>
                <h2 className={classes.ModalTitle}><b>ADD NEW ITEM</b></h2>
                <h2><b>ITEM NAME:</b></h2>
                <input className={classes.BidInputBox} onChange={this.newItemNameHandler}></input>
                <h2><b>START PRICE:</b></h2>
                <input className={classes.BidInputBox} onChange={this.startPriceHandler}></input>
                <h2><b>TIME WINDOW:</b></h2>
                <input className={classes.BidInputBox} onChange={this.timeWindowHandler}></input>
                <div className={classes.BidButtonDiv}>
                    <button type="button" className={classes.BidButton} onClick={this.closeCreateNewItemModal}>Cancel</button>
                    <button type="button" className={classes.BidButton} onClick={this.addNewItem}>Create</button>
                </div>
            </ModalPage>

            <ModalPage
                show={this.state.openDepositModal}>
                <img src='https://www.shutterstock.com/image-photo/bag-money-word-deposit-near-260nw-1276347811.jpg' style={{height: '250px'}}/>
                <h2 className={classes.ModalTitle}><b>DEPOSIT</b></h2>
                <h2><b>AMOUNT (PHP):</b></h2>
                <input className={classes.BidInputBox} onChange={this.depositInputHandler}></input>
                <div className={classes.BidButtonDiv}>
                    <button type="button" className={classes.BidButton} onClick={this.closeDepositModal}>Cancel</button>
                    <button type="button" className={classes.BidButton} onClick={this.deposit}>Deposit</button>
                </div>
            </ModalPage>
        </div>
       );
	}
}

export default HomePage;