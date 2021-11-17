import { Component, OnInit } from '@angular/core';
import { MessageService } from '@progress/kendo-angular-l10n';
import { CustomMessagesService } from 'src/app/services/custom-messages.service';

import { CreateFormGroupArgs, EventStyleArgs, EditMode } from '@progress/kendo-angular-scheduler';
import { FormGroup, FormBuilder } from '@angular/forms';

import { sampleData } from 'src/app/resources/events';
import { Event } from 'src/app/models/event.model';
import { Stock } from 'src/app/models/stock.model';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
    selector: 'app-planning-component',
    templateUrl: './planning.component.html'
})
export class PlanningComponent implements OnInit {
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
        id: null,
        amount: 50,
        quentity: 1,
        email: null,
        sentTo: null,
        phoneNumber: null,
        from: null,
        description: null,
        recurrenceRule: null,
        recurrenceId: null,
        recurrenceExceptions: null,
        teamID: null
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

    constructor(public msgService: MessageService, private formBuilder: FormBuilder) {
        this.customMsgService = this.msgService as CustomMessagesService;
        // this.createFormGroup = this.createFormGroup.bind(this);
        this.data = this.events.slice();
    }

    ngOnInit(): void {
        this.formGroup.valueChanges.subscribe(change => {
            const calculatedPrice = this.calculate(change.amount, change.quentity);
            console.log(calculatedPrice);
            if (calculatedPrice !== this.calculatedValue && calculatedPrice !== undefined) {
                this.calculatedValue = +calculatedPrice;
            }
        });
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
        // console.log(event);
        // const selectedAmount = this.amounts[event].label;
        this.formGroup.controls.amount.setValue(+selectedAmount);
    }
    // public filterEvents(id, selected): Event[] {
    // const cloneData = this.data.slice();

    // if (selected) {
    //     return cloneData.filter((event: Event) => event.teamID !== id);
    // } else {
    //     return [...cloneData, ...this.events.filter((event: Event) => event.teamID === id)];
    // }
    // }

    // public setEventStyles(args: EventStyleArgs): object {
    // const currentTeam = teams.find((team: Team) => team.teamID === args.event.dataItem.teamID);
    // return { backgroundColor: currentTeam.teamColor };
    // }

    // public createFormGroup(args: CreateFormGroupArgs): FormGroup {
    //     const dataItem = args.dataItem;
    //     const isOccurrence = args.mode === EditMode.Occurrence;
    //     const exceptions = isOccurrence ? [] : dataItem.recurrenceExceptions;

    //     this.formGroup = this.formBuilder.group({
    //         id: args.isNew ? this.getNextId() : dataItem.id,
    //         amount: [dataItem.start],
    //         quentity: [dataItem.end],
    //         email: [dataItem.startTimezone],
    //         lastName: [dataItem.endTimezone],
    //         phoneNumber: dataItem.isAllDay,
    //         title: dataItem.title,
    //         description: dataItem.description,
    //         recurrenceRule: dataItem.recurrenceRule,
    //         recurrenceId: dataItem.recurrenceId,
    //         recurrenceExceptions: [exceptions],
    //         teamID: null
    //     });

    //     return this.formGroup;
    // }

    public getNextId(): number {
        const len = this.events.length;
        return len === 0 ? 1 : this.events[this.events.length - 1].id + 1;
    }

    public isEditingSeries(editMode: EditMode): boolean {
        return editMode === EditMode.Series;
    }

    public close(status) {
        console.log(`Dialog result: ${status}`);
        this.opened = false;
    }

    public open() {
        console.log('in');
        this.opened = true;
    }

    // public onClickDialog() {
    //     this.dialogService.open({
    //         title: 'שלח מתנה',
    //         content: PlanningComponent,
    //         width: 900,
    //         height: 550
    //     })
    // }
}
