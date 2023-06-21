import './ModalPage.module.css';
import React, { Component } from 'react';

class ModalPage extends React.Component<any, any>{

    showHideClassName = this.props.show ? "modal display-block" : "modal display-none";

    constructor(props:any) {
        super(props);        
    }

    handleClose = () => {

    }

    render() {
        return(
        <div className={this.showHideClassName}>
            <section className="modal-main">
                {this.props.children}
                <button type="button" onClick={this.handleClose}>
                    Close
                </button>
            </section>
        </div>
        )
    }
}
export default ModalPage;