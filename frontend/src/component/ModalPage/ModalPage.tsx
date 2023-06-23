import classes from './ModalPage.module.css';
import React from 'react';

class ModalPage extends React.Component<any, any>{

    constructor(props: any) {
        super(props);
    }

    render() {
        return(
            <div className={classes.TempClass}>
                {this.props.show ? 
                    <div className={classes.ModalShow}>
                        <section className={classes.ModalMain}>
                            {this.props.children}
                        </section>
                    </div>
                :
                <div className={classes.ModalHide}>
                    <section className={classes.ModalMain}>
                        {this.props.children}
                    </section>
                </div>
            }
            </div>
        )
    }
}
export default ModalPage;