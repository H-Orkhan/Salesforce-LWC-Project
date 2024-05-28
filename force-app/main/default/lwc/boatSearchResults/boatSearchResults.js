import { api,LightningElement,wire,track } from 'lwc';
import { MessageContext, publish } from 'lightning/messageService';
import { ShowToastEvent} from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c'

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT  = 'Ship it!';
const SUCCESS_VARIANT  = 'Ыuccess';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';
export default class BoatSearchResults extends LightningElement {

  @api
  selectedBoatId;
  
  columns = [
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Length', fieldName: 'Length__c', type: 'number'},
    { label: 'Price', fieldName: 'Price__c', type: 'currency'},
    { label: 'Description', fieldName: 'Description__c'},        
];

  boatTypeId = '';
  @track 
  boats;
  isLoading = false;
  
  @track
  draftValues = [];

  @wire(MessageContext)
  messageContext;
  
  @wire(getBoats, {
    boatTypeId: '$boatTypeId'
  })
  wiredBoats({data}) {
    this.isLoading=true;
    this.notifyLoading(this.isLoading);
    if(data) {
    this.boats = data
    .filter(value => value.BoatType__r && value.BoatType__r.Name !== undefined)
    }
    this.isLoading=false;
    this.notifyLoading(this.isLoading)

  }
  
  @api searchBoats(boatTypeId) {
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    this.boatTypeId = boatTypeId;
    this.isLoading = false;
    this.notifyLoading(this.false);
   }
  
  @api async refresh() { 
       this.isLoading = true;
       this.notifyLoading(this.isLoading);
       await refreshApex(this.boats);
       this.isLoading = false;
       this.notifyLoading(this.isLoading);
    }

  
  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
   }
  
  sendMessageService(boatId) { 
        publish(this.messageContext,
          BOATMC,{
            recordId: boatId
          })

  }
  
  handleSave(event) {
    const updatedFields = event.detail.draftValues;
    updateBoatList({data: updatedFields})
    .then(() => {
      const toastEvent = new ShowToastEvent({
        title: SUCCESS_TITLE,
        variant: SUCCESS_VARIANT,
        message: MESSAGE_SHIP_IT
      })
      this.dispatchEvent(toastEvent);
      this.draftValues = [];
      this.refresh();
    })
    .catch(error => {
      const toastEvent = new ShowToastEvent({
        title: ERROR_TITLE,
        variant: ERROR_VARIANT,
        message: error.message
      })
      this.dispatchEvent(toastEvent);
    })
    .finally(() => {});
  }

  notifyLoading(isLoading) {
      if(!isLoading) {
        const customEvent = new CustomEvent('doneloading', {
        })
        this.dispatchEvent(customEvent);
      }

      else {
        const customEvent = new CustomEvent('loading', {
        })
        this.dispatchEvent(customEvent);
      }

   }
}
