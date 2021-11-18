import { Component, OnInit } from '@angular/core';
import { MessageService } from '@progress/kendo-angular-l10n';
import { CustomMessagesService } from 'src/app/services/custom-messages.service';

import { CreateFormGroupArgs, EventStyleArgs, EditMode } from '@progress/kendo-angular-scheduler';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { sampleData } from 'src/app/resources/events';
import { ETF } from 'src/app/resources/ETFData';
import { ETFPapers } from 'src/app/resources/ETFPapers';
import { STOCKSPapers } from 'src/app/resources/STOCKSPapers';
import { accountBank } from 'src/app/resources/accountBank';
import { branches } from 'src/app/resources/branches';
import { STOCKS } from 'src/app/resources/STOCKSData';
import { Event } from 'src/app/models/event.model';
import { Stock } from 'src/app/models/stock.model';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { LoginService } from 'src/app/services/login.service';

@Component({
    selector: 'app-planning-component',
    templateUrl: './planning.component.html'
})
export class PlanningComponent implements OnInit {
    disable = false;

    options: AnimationOptions = {
        path: 'https://assets5.lottiefiles.com/packages/lf20_30iie6.json'
    };

    animationCreated(animationItem: AnimationItem): void {
        console.log(animationItem);
    }

    calculatedValue: number = 0;
    public data: Event[];
    public selectedDate: Date = new Date('2013-06-27T00:00:00Z');
    public formGroup: FormGroup = this.formBuilder.group({
        amount: 50,
        quentity: 1,
        email: null,
        sentTo: null,
        phoneNumber: null,
        from: null,
        message: null,
        paper: null,
        isFamily: null,
        account: null,
        bankAccount: [null, Validators.required],
        branch: [null, Validators.required]
    });
    public customMsgService: CustomMessagesService;
    // public teams = teams;
    public amounts: Array<{ label: string }> = [
        { label: "75" },
        { label: "100" },
        { label: "200" },
        { label: "500" },
    ];
    public events: Event[] = sampleData;
    public opened = false;
    public generalData = ETF;
    public generalPapers: Array<any> = [];
    public etfData = ETF;
    public etfPapers = ETFPapers;
    public stocksData = STOCKS;
    public stocksPapers = STOCKSPapers;
    public selectedPaper = 'etf';
    public accountBank = accountBank;
    public branches = branches;
    public branchesPerBank: Array<any> = [];


    constructor(public msgService: MessageService, private formBuilder: FormBuilder, private loginService: LoginService) {
        this.customMsgService = this.msgService as CustomMessagesService;
        // this.createFormGroup = this.createFormGroup.bind(this);
        this.data = this.events.slice();
    }

    ngOnInit(): void {
        this.formGroup.valueChanges.subscribe(change => {
            const calculatedPrice = this.calculate(change.amount, change.quentity);
            if (calculatedPrice !== this.calculatedValue && calculatedPrice !== undefined) {
                this.calculatedValue = +calculatedPrice;
            }
        });
    }

    onSelect(event){
        const formValues = JSON.stringify(event);
        localStorage.setItem('deatilPaper', formValues);
    }

    calculate(amount: any, quentity: any) {
        if (amount && quentity) {
            return +amount * +quentity;
        } else {
            return null;
        }
    }

    public toggleEvents(stock: Stock): void {
        // this.data = [...this.filterEvents(stock.stockId, stock.selected)];
    }
    public selected(selectedAmount) {
        this.formGroup.controls.amount.setValue(+selectedAmount);
    }


    public getNextId(): number {
        const len = this.events.length;
        return len === 0 ? 1 : this.events[this.events.length - 1].id + 1;
    }

    public isEditingSeries(editMode: EditMode): boolean {
        return editMode === EditMode.Series;
    }

    public close(status) {
        this.opened = false;
    }

    public send() {
        const formValues = JSON.stringify(this.formGroup.value);
        localStorage.setItem('deatils', formValues);

        console.log(this.formGroup.value);
        this.opened = true;
    }

    onChange(selected) {
        this.selectedPaper = selected;
        if (selected === 'etf') {
            this.generalData = null;
            this.generalPapers = [];
            this.generalData = this.etfData;
        } else if (selected === 'stocks') {
            this.generalData = null;
            this.generalPapers = [];
            this.generalData = this.stocksData;
        }
    }

    moreStocks() {
        this.disable = !this.disable;
    }

    public filterSettings: DropDownFilterSettings = {
        caseSensitive: false,
        operator: "contains",
    };

    selectedChanged(selectedPaper) {
        if (selectedPaper !== undefined) {
            if (this.selectedPaper === 'etf') {
                this.etfPapers.forEach(name => {
                    if (name.anafim === selectedPaper) {
                        this.generalPapers.push(name);
                    }
                });
            } else if (this.selectedPaper === 'stocks') {
                this.generalPapers = this.stocksPapers;
            }
        }
    }

    selectedBankChanged(selectedBank) {
        this.branchesPerBank = [];
        if (selectedBank !== undefined) {
            this.branches.forEach(name => {
                if (name.code === +selectedBank) {
                    this.branchesPerBank.push(name);
                }
            });
            this.branchesPerBank = this.branchesPerBank.filter((v, i, a) => a.findIndex(t => t.fullBranch === v.fullBranch) === i);
        }
    }
}
