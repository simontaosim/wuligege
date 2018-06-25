import React from 'react';
import {store} from '../store';
class MovieList extends React.Component{

    handleItemClick = () => {
        console.log('click');
        store.get('layoutRenders').then(doc=>{
            doc.moviePlayer = true;
            doc.home = false;
            doc.current = "moviePlayer";
            store.put(doc).then(msg=>{
                console.log(msg);
                
            }).then(err=>{
                console.log('错误', err);
                
            });
        })
        
    }

    render(){
        return (
            <div className="movie-list">
                <div onClick={this.handleItemClick}>电影1</div>
                <div onClick={this.handleItemClick}>电影2</div>
                <div onClick={this.handleItemClick}>电影3</div>
                <div onClick={this.handleItemClick}>电影4</div>
            </div>
        )
    }
}

export default MovieList;