import React, { Component } from 'react';
import './App.css';
import {store, connect} from './store';
import MoviePlayer from './components/MoviePlayer';
import MovieList from './components/MovieList';

const initProps = {
  _id: 'layoutRenders',
  home: false,
  moviePlayer: false,
  MovieList: false,
  progress: true,
  appTitle: '巫力格格',
  current: 'home'
}

class App extends Component {

  constructor(props){
    super(props);
    
  }

  componentDidMount(){
    store.get('layoutRenders').then(doc=>{
      if(!doc){
        store.put(initProps).then(msg=>{
          console.log(msg);
          
        }).catch(err=>{
          console.log('错误', err);


        });
      }else{
        doc.home = true;
        doc.progress = false;
        doc.moviePlayer = false;
        doc.current = "home";
        store.put(doc).then(msg=>{
          console.log(msg);
          
        }).catch(err=>{
          console.log('错误', err);


        });
      }
      
    }).catch(err=>{
        console.log('错误', err);
    })
    
  }
   render() {

    return (
      <div className="container App">
        <div>
          <h2>{this.props.appTitle}</h2>
        </div>
        {this.props.progress &&
          <div className="spinner primary"></div>
        }
        {this.props.home &&
          <MovieList />
        }
        {this.props.moviePlayer &&
          <MoviePlayer />
        }
         
      </div>
    );
  }
}

export default connect(initProps)(App);
