import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { MessageService } from '@progress/kendo-angular-l10n';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Subscription } from 'rxjs';
import { accountBank } from 'src/app/resources/accountBank';
import { branches } from 'src/app/resources/branches';
import { CustomMessagesService } from 'src/app/services/custom-messages.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
    selector: 'app-info-component',
    templateUrl: './info.component.html',
})
export class InfoComponent implements OnInit, OnDestroy {
    public customMsgService: CustomMessagesService;
    formGroup: FormGroup = this.formBuilder.group({
        bankAccount: null,
        branch: null,
        account: null,
        holding: ['IBI'],
        bless: null,
        paper: null,
        quentity: null,
        amount: null
    });
    public branches = branches;
    public branchesPerBank: Array<any> = [];
    public accountBank = accountBank;
    isTrust = false;
    public opened = false;
    subscription = new Subscription();

    options: AnimationOptions = {
        path: 'https://assets5.lottiefiles.com/packages/lf20_30iie6.json'
    };

    animationCreated(animationItem: AnimationItem): void {
        console.log(animationItem);
    }

    constructor(public msgService: MessageService, private formBuilder: FormBuilder, private loginService: LoginService) {
        this.customMsgService = this.msgService as CustomMessagesService;
    }

    ngOnInit(): void {
        const form = localStorage.getItem('deatils');
        const formPaper = localStorage.getItem('deatilPaper');
        const details = JSON.parse(form);
        const paper = JSON.parse(formPaper);

        console.log(details);
        console.log(paper);
        if (form) {
            this.formGroup.controls.paper.setValue(details['message']);
            this.formGroup.controls.quentity.setValue(+details['quentity']);
            this.formGroup.controls.amount.setValue(+details['amount']);
            this.formGroup.controls.bless.setValue(paper['nameValue']);
        }
    }

    public filterSettings: DropDownFilterSettings = {
        caseSensitive: false,
        operator: "contains",
    };

    public onChange(selectedSecurity) {
        this.isTrust = selectedSecurity === 'trust' ? false : true;
    }

    selectedBankChanged(selectedBank) {
        this.branchesPerBank = [];
        if (selectedBank !== undefined) {
            this.branches.forEach(name => {
                if (name.code === +selectedBank) {
                    this.branchesPerBank.push(name);
                }
            });
            this.branchesPerBank = this.branchesPerBank.filter((v, i, a) => a.findIndex(t => t.city === v.city) === i);
        }
    }

    send() {
        this.opened = true;
    }

    close() {
        this.opened = false;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
