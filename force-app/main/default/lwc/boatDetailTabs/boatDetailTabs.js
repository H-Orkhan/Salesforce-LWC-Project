import { LightningElement,api,wire } from 'lwc';
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';
import { subscribe,APPLICATION_SCOPE,MessageContext } from 'lightning/messageService';
import { NavigationMixin } from 'lightning/navigation';

import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c'

import labelDetails from "@salesforce/label/c.Details";
import labelReviews from "@salesforce/label/c.Reviews";
import labelAddReview from "@salesforce/label/c.Add_Review";
import labelFullDetails from "@salesforce/label/c.Full_Details";
import labelPleaseSelectABoat from "@salesforce/label/c.Please_select_a_boat";

import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id'
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name'

const BOAT_OBJECT = 'Boat__c';
const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];
const ICON = 'utility:anchor';

export default class BoatDetailTabs extends NavigationMixin (LightningElement) {
  
  @api boatId;

  @wire(getRecord, {recordId: '$boatId',fields:BOAT_FIELDS})
  wiredRecord;

  @wire(MessageContext)
  messageContext;

  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat,
  };
  
  get detailsTabIconName() {
      return this.wiredRecord === undefined || this.wiredRecord == null ? null : ICON;
   }
  
  get boatName() {
    return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
   }
  
  subscription = null;
  
  subscribeMC() {
    this.subscription = subscribe(
      this.messageContext,BOATMC, ((message)=> {
        this.boatId = message.recordId;
      }),
      { scope: APPLICATION_SCOPE }
    )
  }
  
  connectedCallback() {
    this.subscribeMC();
   }
  
  navigateToRecordViewPage() {
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: this.boatId,
            objectApiName: BOAT_OBJECT,
            actionName: "view"
        },
    });
}
  
  handleReviewCreated() { 
    this.template.querySelector('lightning-tabset').activeTabValue = 'reviews';
    this.template.querySelector('c-boat-reviews').refresh();
  }
}
