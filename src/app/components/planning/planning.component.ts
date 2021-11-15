import { Component } from '@angular/core';
import { MessageService } from '@progress/kendo-angular-l10n';
import { CustomMessagesService } from 'src/app/services/custom-messages.service';

import { CreateFormGroupArgs, EventStyleArgs, EditMode } from '@progress/kendo-angular-scheduler';
import { FormGroup, FormBuilder } from '@angular/forms';

import { sampleData } from 'src/app/resources/events';
import { teams } from 'src/app/resources/teams';
import { Team } from 'src/app/models/team.model';
import { Security } from 'src/app/models/security.model';
import { Event } from 'src/app/models/event.model';
import { Stock } from 'src/app/models/stock.model';

@Component({
    selector: 'app-planning-component',
    templateUrl: './planning.component.html'
})
export class PlanningComponent {
    public data: Event[];
    public selectedDate: Date = new Date('2013-06-27T00:00:00Z');
    public formGroup: FormGroup = this.formBuilder.group({
        id: null,
        amount: 50,
        end: null,
        startTimezone: null,
        endTimezone: null,
        isAllDay: null,
        title: null,
        description: null,
        recurrenceRule: null,
        recurrenceId: null,
        recurrenceExceptions: null,
        teamID: null
    });
    public customMsgService: CustomMessagesService;
    // public teams = teams;
    public amounts: Array<{ label: string }> = [
        { label: "25" },
        { label: "50" },
        { label: "100" },
    ];
    public events: Event[] = sampleData;

    constructor(public msgService: MessageService, private formBuilder: FormBuilder) {
        this.customMsgService = this.msgService as CustomMessagesService;
        this.createFormGroup = this.createFormGroup.bind(this);
        this.data = this.events.slice();
    }

    public toggleEvents(stock: Stock): void {
        // this.data = [...this.filterEvents(stock.stockId, stock.selected)];
    }
    public selected(event) {
        const selectedAmount = this.amounts[event].label;
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

    public createFormGroup(args: CreateFormGroupArgs): FormGroup {
        const dataItem = args.dataItem;
        const isOccurrence = args.mode === EditMode.Occurrence;
        const exceptions = isOccurrence ? [] : dataItem.recurrenceExceptions;

        this.formGroup = this.formBuilder.group({
            id: args.isNew ? this.getNextId() : dataItem.id,
            amount: [dataItem.start],
            end: [dataItem.end],
            startTimezone: [dataItem.startTimezone],
            endTimezone: [dataItem.endTimezone],
            isAllDay: dataItem.isAllDay,
            title: dataItem.title,
            description: dataItem.description,
            recurrenceRule: dataItem.recurrenceRule,
            recurrenceId: dataItem.recurrenceId,
            recurrenceExceptions: [exceptions],
            teamID: null
        });

        return this.formGroup;
    }

    public getNextId(): number {
        const len = this.events.length;
        return len === 0 ? 1 : this.events[this.events.length - 1].id + 1;
    }

    public isEditingSeries(editMode: EditMode): boolean {
        return editMode === EditMode.Series;
    }
}
