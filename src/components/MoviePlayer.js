import React from 'react'
// import WebTorrent from 'webtorrent/webtorrent.min.js';
import './MoviePlayer.css';
import moment from 'moment';
const torrentId = 'magnet:?xt=urn:btih:2a134f42b4a1620a916c0e91241b5cedab87e7c7&dn=%E9%BA%BB%E5%91%82%E3%81%AE%E6%82%A3%E8%80%85%E3%81%AF%E3%82%AC%E3%83%86%E3%83%B3%E7%B3%BB+Maro+no+Kanja+wa+Gatenkei+-+Episode+01+%5BUNC%5D+WEB-720PX+%5BEngSub%5D.mp4&tr=http%3A%2F%2Fbt.popgo.net%3A7456%2Fannounce&tr=http%3A%2F%2Fbt.titapark.com%3A2710%2Fannounce&tr=http%3A%2F%2Fbtfans.3322.org%3A6969%2Fannounce&tr=http%3A%2F%2Fbtfans.3322.org%3A8000%2Fannounce&tr=http%3A%2F%2Fbtfans.3322.org%3A8080%2Fannounce&tr=http%3A%2F%2Fscubt.wjl.cn%3A8080%2Fannounce&tr=http%3A%2F%2Fthetracker.org%2Fannounce&tr=http%3A%2F%2Ftk3.5qzone.net%3A8080%2F&tr=http%3A%2F%2Ftracker.bittorrent.am%2Fannounce&tr=http%3A%2F%2Ftracker.btzero.net%3A8080%2Fannounce&tr=http%3A%2F%2Ftracker.dmhy.org%3A8000%2Fannounce&tr=http%3A%2F%2Ftracker.ktxp.com%3A6868%2Fannounce&tr=http%3A%2F%2Ftracker.ktxp.com%3A7070%2Fannounce&tr=http%3A%2F%2Ftracker.prq.to%2Fannounce&tr=http%3A%2F%2Ftracker.publicbt.com%2Fannounce&tr=http%3A%2F%2Ftracker.tjgame.enorth.com.cn%3A8000%2Fannounce&tr=udp%3A%2F%2Ftracker.bitcomet.net%3A8080%2Fannounce&tr=udp%3A%2F%2Ftracker.ktxp.com%3A6868%2Fannounce&tr=udp%3A%2F%2Ftracker.ktxp.com%3A7070%2Fannounce&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com'
var WebTorrent = require('webtorrent')
class MoviePlayer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            progress: 0,
            numPeers: '',
            downloaded: 0,
            total: 0,
            uploadSpeed: 0,
            downloadSpeed: 0,
            remaining: 0,
            percent: 0,
            file: null,
            totalTip: "加载中..."
        }
        this.webTorrent = new WebTorrent();

    }

    onProgress = (torrent) => {
        if(torrent){
            console.log("种子数量", torrent.numPeers);
            
            let numPeers = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers');
            this.setState({
                numPeers,
                totalTip: ''

            });
            let percent = Math.round(torrent.progress * 100 * 100) / 100;
            this.setState({
                percent
            })
            let total = this.prettyBytes(torrent.length)
            this.setState({
                    total
            });
            let downloadSpeed = this.prettyBytes(torrent.downloadSpeed) + '/s'
            this.setState({
                downloadSpeed
            });

            let uploadSpeed = this.prettyBytes(torrent.uploadSpeed)+ '/s';
            this.setState({
                uploadSpeed
            });

            let remaining
            if (torrent.done) {
                remaining = 'Done.'
            } else {
                remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
                remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
            }
            this.setState({
                remaining
            });



        }
       

    }
    prettyBytes = (num) => {
        var exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        if (neg) num = -num
        if (num < 1) return (neg ? '-' : '') + num + ' B'
        exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
        num = Number((num / Math.pow(1000, exponent)).toFixed(2))
        unit = units[exponent]
        return (neg ? '-' : '') + num + ' ' + unit
    }

    getFileFromTorrent = (torrent) => {
        let file = torrent.files.find((file) =>{
            return file.name.endsWith('.mp4')
          })
  
          // Stream the file in the browser
          let output = this.refs.output;
          file.appendTo(output,{
              autoplay: true
          });
          
          
         
    }
    onDone=(torrent)=>{
        this.refs.videoRoot.className += ' is-seed';
        this.onProgress(torrent);
    }

    watchDownloading=(torrent)=>{
        this.getFileFromTorrent(torrent);
        setInterval(()=>this.onProgress(torrent), 500)
        this.onProgress(torrent);
        torrent.on('done', ()=>this.onDone(torrent))
        
    }
    componentDidMount(){
        this.webTorrent.add(torrentId, torrent=>this.watchDownloading(torrent));
        
        

    }
    render(){
        return (
            <div ref="videoRoot">
                <div id="hero">
                    <div id="output" ref="output">
                        <div id="progressBar" style={{width: this.state.percent+"%"}} ref='progressBar'></div>
                    </div>
                    <div id="status">
                        <div>
                        <span className="show-leech">Downloading </span>
                        <span className="show-seed">Seeding </span>
                        <code>
                            <a id="torrentLink" href="https://webtorrent.io/torrents/sintel.torrent">sintel.torrent</a>
                        </code>
                        <span className="show-leech"> from </span>
                        <span className="show-seed"> to </span>
                        <code id="numPeers">{this.state.numPeers}</code>.
                        </div>
                        <div>
                        <code id="downloaded"></code>
                        of <code id="total">{this.state.total}</code>
                        — <span id="remaining">{this.state.remaining}</span><br/>
                        &#x2198;<code id="downloadSpeed">{this.state.downloadSpeed} b/s</code>
                        / &#x2197;<code id="uploadSpeed">{this.state.uploadSpeed} b/s</code>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MoviePlayer