function HelpMeDecideCalculator() {

    this.calculateWeight = calculateWeight;

    this.manyOwners = 0;
    this.separatePersonalAsset = 0;
    this.businessLossReduceTax = 0;
    this.mostImportant = 0;
    this.planToSell = 0;
    this.calculated = false;
    // this is where the calculation happens
    // please note that 1 or 2 is just the option user made
    // 1 means user selected first option
    // 2 means user selected second option
    function calculateWeight() {
        var companyWeight = 0;
        var partnerWeight = 0;
        var soletraderWeight = 0;
        var trustWeight = 0;
        var superWeight = 100;

        this.calculated = true;
        // How many owners will your business have?
        if (this.manyOwners === 1) {
            soletraderWeight += 1;
        }
        else if (this.manyOwners === 2) {
            partnerWeight += 1;
        }

        // Do you want to separate your personal income and assets (such as your home) from your business?
        if (this.separatePersonalAsset == 1) {
            soletraderWeight = 0;
            partnerWeight = 0;
        }
        else if (this.separatePersonalAsset === 2) { // once this conditions met, then the calucation should be stopped and there should be a result.
            if (soletraderWeight > partnerWeight)
                return "soletrader";
            else
                return "partnership"
        }

        // Are you participating in an industry that is vulnerable to lawsuits?
        if (this.businessLossReduceTax === 1) {
            companyWeight += 1;
        }
        else if (this.businessLossReduceTax === 2) {
            trustWeight += 1;
        }

        // Do you want full control over your business decisions?
        if (this.mostImportant === 1) {
            companyWeight += 1;
        }
        else if (this.mostImportant === 2) {
            trustWeight += 1;
        }

        // Do you want to set up a separate entity for your business?
        if (this.planToSell === 1) {
            companyWeight += 1;
        }
        else if (this.planToSell === 2) {
            trustWeight += 1;
        }

        if (companyWeight > trustWeight) {
            return "company";
        }
        else {
            return "trust";
        }
    }
}

