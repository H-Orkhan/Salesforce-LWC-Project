import { api, LightningElement ,wire} from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEvent} from 'lightning/platformShowToastEvent'

const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
export default class BoatsNearMe extends LightningElement {
 
  @api
  boatTypeId;
  mapMarkers = [];
  isLoading = true;
  isRendered;
  latitude;
  longitude;
  
  @wire(getBoatsByLocation, {
    latitude: '$latitude',
    longitude: '$longitude',
    boatTypeId: '$boatTypeId'
  })
  wiredBoatsJSON({data}) { 
    if(data) {
        this.createMapMarkers(data);
    }
    else{
          const toastEvent = new ShowToastEvent({
                title:ERROR_TITLE,
                message: "Boat data is not allowed",
                variant: ERROR_VARIANT
            });
        this.dispatchEvent(toastEvent);
    }
    this.isLoading = false;

  }
  
  renderedCallback() { 
    if(!this.isRendered) {
        this.getLocationFromBrowser();
    }
    this.isRendered = true;

  }
  
  getLocationFromBrowser() {
    if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        this.longitude = position.coords.longitude;
        this.latitude =position.coords.latitude;
        })
    }
   }
  

  createMapMarkers(boatData) {
    let newMarkers = JSON.parse(boatData)
    .filter(value => value.Geolocation__Latitude__s && value.Geolocation__Longitude__s)
    .map(boat =>  {
        return {
        title: boat.Name,
        location: {
            Latitude: boat.Geolocation__Latitude__s,
            Longitude: boat.Geolocation__Longitude__s
        }
    
  }
  });

     newMarkers.unshift({
        title:LABEL_YOU_ARE_HERE,
        icon:ICON_STANDARD_USER,
        location: {
            Latitude: this.latitude,
            Longtitude: this.longitude
        }
     });
     this.mapMarkers = newMarkers;
   }
}
