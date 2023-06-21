import axios from 'axios';
import React, { Component } from 'react';
import classes from './HomePage.module.css'
import { Link } from 'react-router-dom';
// import { Modal } from 'react-responsive-modal';
// import 'react-responsive-modal/styles.css';
import ModalPage from "../../component/ModalPage/ModalPage";

class HomePage extends React.Component<any, any>{

    interval: any;

    constructor(props: any) {
        super(props);        
        this.state = {
            completedBid: null,
            ongoingBid: null,
            completedBidFlag: true,
            ongoingBidFlag: false,
            basicModal: false
            // completedBidFlag: false,
            // ongoingBidFlag: true
        }
    }

    setViewMode = (view_mode: any) => {

    }

    bidItem = () => {

    }

    setCompletedViewMode = (event: any) => {
        event.preventDefault();
        this.setState({completedBidFlag: true});
        this.setState({ongoingBidFlag: false});
    }

    setOngoingViewMode = (event: any) => {
        event.preventDefault();
        this.setState({completedBidFlag: false});
        this.setState({ongoingBidFlag: true});
    }

    toggleShow = (event: any) => {
        // this.showModal = this.showModal.bind(this);
        // hideModal = this.hideModal.bind(this);        
    }

    onCloseModal = () =>{
        this.setState({basicModal: false})
    }    

	componentDidMount = () => {
		axios.get('http://localhost:8086/api/render-home/ongoing-bid-items').then(response => {
            console.log('[DEBUGGING] /api/render-home/ongoing-bid-items');
            console.log(response);
            if(response.data.exit_code !== '200'){
                // window.alert(response.data.exit_message.msg);
                return
            }
            else {
                this.setState({ongoingBid: response.data.result});
               ;
            }
		});

		axios.get('http://localhost:8086/api/render-home/completed-bid-items').then(response => {
            console.log('[DEBUGGING] /api/render-home/completed-bid-items');
            console.log(response);
            if(response.data.exit_code !== '200'){
                // window.alert(response.data.exit_message.msg);
                return
            }
            else {
                this.setState({completedBid: response.data.result});
            }
		})
		this.forceUpdate();
    };

    // componentDidUpdate = () => {
	// 	axios.get('http://localhost:8086/api/render-home/ongoing-bid-items').then(response => {
    //         console.log('[DEBUGGING] /api/render-home/ongoing-bid-items');
    //         if(response.data.exit_code !== '200'){
    //             window.alert(response.data.exit_message);
    //             return
    //         }
    //         else {
    //             this.interval = setInterval(() => this.setState({ongoingBid: response.data.result}), 5000);
    //            ;
    //         }
	// 	});
    // }    

    componentWillUnmount() {
        clearInterval(this.interval);
    }    

	render() {
		var ongoing_bid_items = [], i = 0;
		if (this.state.ongoingBid !== null) {
			for (i=0; i<this.state.ongoingBid.length; i++){
				ongoing_bid_items.push(
                    <div className={classes.AuctionItem}>
                        <img src='https://www.shutterstock.com/image-vector/auction-label-red-band-sign-260nw-1514047166.jpg' style={{height: '200px'}}/>
                        <h1>{this.state.ongoingBid[i].item_name.toUpperCase()}</h1>
                        <h3>ID: {this.state.ongoingBid[i].id}</h3>
                        <h2>CURRENT PRICE: PHP {this.state.ongoingBid[i].current_price}</h2>
                        <h2>AUCTION END: {this.state.ongoingBid[i].end_date} {this.state.ongoingBid[i].end_time}</h2>
                        <div>
                            <button className={classes.BidButton} id={'bid_button_'+i} onClick={this.toggleShow}>BID</button>
                            <ModalPage 
                                open={this.state.basicModal}
                                onClose={this.onCloseModal.bind(this)}>
                                <h1>You Did it!</h1>
                            </ModalPage>
                        </div>
                    </div>
                );
			}
		}

		var completed_bit_items = [], i = 0;
		if (this.state.completedBid !== null) {
			for (i=0; i<this.state.completedBid.length; i++){
				completed_bit_items.push(
                    <div className={classes.AuctionItem}>
                        <img src='https://www.shutterstock.com/image-vector/auction-label-red-band-sign-260nw-1514047166.jpg' style={{height: '200px'}}/>
                        <h1>{this.state.completedBid[i].item_name.toUpperCase()}</h1>
                        <h3>ID: {this.state.completedBid[i].id}</h3>
                        <h2>FINAL PRICE: PHP {this.state.completedBid[i].current_price}</h2>
                    </div>
                );
			}
		}

        return(
        <div className={classes.HomePage}>
            <div className={classes.container}>
                <img src='https://www.pinclipart.com/picdir/big/404-4045342_customers-for-your-business-animated-people-transparent-background.png' className={classes.headerImage}/>
                <p className={classes.headerText}>ONLINE AUCTION SYSTEM</p>

                <div className={classes.headerMenu}>
                    <div>
                        <button className={classes.headerMenuSelection} onClick={() => this.setViewMode('create_new_item')}><b>ADD NEW ITEM</b></button>
                    </div>
                    <div>
                        <button className={classes.headerMenuSelection} onClick={() => this.setViewMode('deposit')}><b>DEPOSIT</b></button>
                    </div>
                    <div>
                        <button className={classes.headerMenuSelection} onClick={() => this.setViewMode('logout')}><b>LOGOUT</b></button>
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
                        {completed_bit_items}
                    </div>
                    :
                    <div className={classes.OngoingCompletedPageDivProducts}>
                        <h1>Showing Ongoing Bid Items</h1>
                        {ongoing_bid_items}
                    </div>
                }
            </div>
        </div>
       );
	}
}

export default HomePage;