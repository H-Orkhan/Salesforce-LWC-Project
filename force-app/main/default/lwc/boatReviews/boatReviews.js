import { LightningElement,api,wire } from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { NavigationMixin } from 'lightning/navigation';

export default class BoatReviews extends NavigationMixin(LightningElement) {
    boatId;
    error;

    boatReviews;
    isLoading;
    
    @api get recordId() { 
      return this.boatId;
    }

    set recordId(value) {
      this.setAttribute('boatId', value);
      this.boatId = value;
      this.getReviews();
    }
    
    get reviewsToShow() {
      return (this.boatReviews !== null) && (this.boatReviews !== undefined) && (this.boatReviews.length >0)
     }
    
    @api refresh() { 
        this.getReviews();
    }
    
    getReviews() { 
      if(this.boatId) {
      this.isLoading = true;
      getAllReviews({boatId: this.boatId})
      .then((result) => {
        this.boatReviews = result;
        this.error = undefined;
    })
      .catch((error) => {
        this.error = error;
    })
      .finally(() => {
      this.isLoading = false;

  })}
    else {
      return;
    }
  }
    
    navigateToRecord(event) { 
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
          recordId: event.target.dataset.recordId,
          objectApiName: "User",
          actionName: "view"
      },
  });
     }
  }
  