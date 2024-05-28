import { LightningElement, api, wire } from 'lwc';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS ='tile-wrapper';
const BACKGROUND_IMAGE_LEFT_LABEL = 'background-image:url(';
const BACKGROUND_IMAGE_RIGHT_LABEL = ')';

export default class BoatTile extends LightningElement {

    @api boat;
    @api selectedBoatId;
    
    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() {
        return BACKGROUND_IMAGE_LEFT_LABEL + this.boat.Picture__c + BACKGROUND_IMAGE_RIGHT_LABEL;  
     }
    
    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() {
        return this.boat.Id == this.selectedBoatId ? TILE_WRAPPER_SELECTED_CLASS : TILE_WRAPPER_UNSELECTED_CLASS;
     }
    
    // Fires event with the Id of the boat that has been selected.
    selectBoat() { 
    this.selectedBoatId = this.boat.Id;
    const boatSelect = new CustomEvent('boatselect',{
        detail: {
            boatId: this.selectedBoatId
        }
    })
    this.dispatchEvent(boatSelect);
    }
    
  }
  