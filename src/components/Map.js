import React from 'react';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import {connect} from 'react-redux'

class Map extends React.Component{
    constructor(props){
        super();
        this.state = {
            lng: -73.879321,
            lat: 40.73645,
            zoom: 10
          };
    }

    
    componentDidMount(){
        //this key is restricted on mapbox website, the key that should be hidden is the key that can fetch directions
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXJ6eSIsImEiOiJja29nMHpvMmQwbmh4Mm5wd3FmZHo1cWg0In0.cfrKpHwNtWsOx224hRN25A'
        const { lng, lat, zoom } = this.state;
        this.map = new mapboxgl.Map({
            container: 'map-container',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        this.map.on('move', () => {
              this.setState({
                lng: this.map.getCenter().lng.toFixed(4),
                lat: this.map.getCenter().lat.toFixed(4),
                zoom: this.map.getZoom().toFixed(2)
              });
        });
      
    }
    render(){

        //everything in here will rerender once state/prop is changed
        //initially resp is null; how do we run this method once resp is equal to an object so that we can use that object to display lines on map
        //how do we trigger this method everytime resp changes so that everytime resp changes we display new lines according to new resp
        //re-render

        //once there is an API response, use the response to display the lines, and fitBounds to lines
        //once API response changes, our props changes, causing a re-render and therefore drawing new lines ;)
        if(!!(this.props.resp)){
            if(this.map.getSource('route')){
                this.map.removeLayer('route');
                this.map.removeSource('route');
            }
            this.map.addSource('route',{
                'type':'geojson',
                'data':{
                    'type':'Feature',
                    'properties': {},
                    'geometry':{
                        'type':'LineString',
                        'coordinates':this.props.resp.routes[0].geometry.coordinates
                    }
                }
            });
            this.map.addLayer({
                'id':'route',
                'type':'line',
                'source':'route',
                'layout':{
                    'line-join':'round',
                    'line-cap': 'round'
                },
                'paint':{
                    'line-color':'#23a641',
                    'line-width':8
                }
            });
            // this.props.resp.waypoints contains the origin and destination coordinates along street names and other things
            this.map.fitBounds([this.props.resp.waypoints[0].location,this.props.resp.waypoints[1].location],{padding:50})
        }

    return (
        <div id='map-container' class='map-container'>

        </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        resp:state.resp
    }
}


export default connect(mapStateToProps)(Map);