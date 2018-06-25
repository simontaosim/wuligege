import PouchDB from 'pouchdb';
import React from 'react'
export const store = new PouchDB('wuligege');

export const DBComponent = (WrappedComponent) => {
    return class extends React.Component{
        constructor(props){
            super(props);
        }
        render(){
            return <WrappedComponent {...this.props}/>
        }
    }
}

export  function  connect(props){
    
    return com => {
        let StoreCom = DBComponent(com);
        const initProps = props;
        return class extends React.Component{
            constructor(props){
                super(props);
                this.state=initProps;
                this.change = store.changes({
                    since: 'now',
                    live: true,
                    include_docs: true
                  }).on('change', (change)=> {
                    // handle change
                    this.setState(change.doc)
                    
                  }).on('complete', function(info) {
                    // changes() was canceled
                  }).on('error', function (err) {
                    console.log('错误', err);
                  });
            }
            componentDidMount(){
                store.get(initProps._id).then(doc=>{
                    if(!doc){
                        store.put(doc).then(msg=>{
                            console.log(msg);
                            
                        }).catch(err=>{
                            console.log('错误', err);
                            
                        });
                    }else{
                        store.put(initProps).then(msg=>{
                            console.log(msg);
                            
                        }).catch(err=>{
                            if(err.name==="conflict"){
                                return false;
                            }
                            console.log("错误", err);
                            
                        });
                    }
                    this.setState(initProps);
                    
                }).catch(err=>{
                    console.log('错误', err);
                    
                    if(err.name="not_found"){
                        store.put(initProps).then(msg=>{
                            console.log(msg);
                            
                        }).then(err=>{
                            console.log("错误", err);
                            
                        });
                        this.setState(initProps);
                    }
                })
            }
            componentWillUnmount(){
                this.change.cancel();
            }
            render(){
                return <StoreCom {...this.state}/>
            }
        }
    }
    
    
};


