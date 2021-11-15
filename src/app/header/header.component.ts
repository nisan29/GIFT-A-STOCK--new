import { Component, EventEmitter, Inject, Input, LOCALE_ID, Output } from '@angular/core';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { MessageService } from '@progress/kendo-angular-l10n';
import { CustomMessagesService } from '../services/custom-messages.service';
import { locales } from 'src/app/resources/locales';
import { DialogService } from '@progress/kendo-angular-dialog';
import { PlanningComponent } from '../components/planning/planning.component';

@Component({
    selector: 'app-header-component',
    templateUrl: './header.commponent.html'
})
export class HeaderComponent {
    @Output() public toggle = new EventEmitter();
    @Input() public selectedPage: string;

    public customMsgService: CustomMessagesService;
    public locales = locales;

    public selectedLanguage = { locale: 'עברית', localeId: 'he-IL' };

    constructor(public messages: MessageService, @Inject(LOCALE_ID) public localeId: string, public intlService: IntlService,
        private dialogService: DialogService) {
        this.localeId = this.selectedLanguage.localeId;
        this.setLocale(this.localeId);
        this.customMsgService = this.messages as CustomMessagesService;
        this.customMsgService.language = this.selectedLanguage.localeId;
    }

    public changeLanguage(item): void {
        this.customMsgService.language = item.localeId;
        this.setLocale(item.localeId);
    }

    public setLocale(locale): void {
        (this.intlService as CldrIntlService).localeId = locale;
    }

    public onButtonClick(): void {
        this.toggle.emit();
    }

    public onClickDialog() {
        this.dialogService.open({
            title: 'שלח מתנה',
            content: PlanningComponent,
            width: 900,
            height: 550
        })
    }
}
