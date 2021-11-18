import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { MessageService } from '@progress/kendo-angular-l10n';
import { DrawerComponent, DrawerMode, DrawerSelectEvent } from '@progress/kendo-angular-layout';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CustomMessagesService } from './services/custom-messages.service';
import { LoginService } from './services/login.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
    public selected = 'התיק שלי';
    public items: Array<any>;
    public customMsgService: CustomMessagesService;
    public mode: DrawerMode = 'push';
    public mini = true;
    hidden: boolean;
    subscription = new Subscription();

    constructor(private router: Router, public msgService: MessageService, private loginService: LoginService) {
        this.customMsgService = this.msgService as CustomMessagesService;
    }

    ngOnInit() {
        this.subscription.add(this.loginService.isHidden
            .pipe(
                delay(1000))
            .subscribe(isHidden => {
                this.hidden = isHidden;
            }));

        // Update Drawer selected state when change router path
        this.router.events.subscribe((route: NavigationStart) => {
            if (route instanceof NavigationStart) {
                this.items = this.drawerItems().map((item) => {
                    if (item.path && item.path === route.url && item.text !== 'התנתק') {
                        item.selected = true;
                        return item;
                    } else {
                        item.selected = false;
                        return item;
                    }
                });
            }
        });

        this.setDrawerConfig();

        this.customMsgService.localeChange.subscribe(() => {
            this.items = this.drawerItems();
        });

        window.addEventListener('resize', () => {
            this.setDrawerConfig();
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        window.removeEventListener('resize', () => { });
    }

    isHidden(event) {
        console.log(event);
        this.hidden = event;
    }

    public setDrawerConfig() {
        const pageWidth = window.innerWidth;
        if (pageWidth <= 770) {
            this.mode = 'overlay';
            this.mini = false;
        } else {
            this.mode = 'push';
            this.mini = true;
        }
    }

    public drawerItems() {
        return [
            { text: 'התיק שלי', icon: 'k-i-grid', path: '/team', selected: true },
            { text: 'מצב הנכסים שלי', icon: 'k-i-chart-line-markers', path: '/dashboard', selected: false },
            { text: 'מידע אישי', icon: 'k-i-user', path: '/profile', selected: false },
            { separator: true },
            { text: 'מידע', icon: 'k-i-information', path: '/info', selected: false },
            { separator: true },
            { text: 'התנתק', icon: 'k-i-logout', path: '/dashboard', selected: false },
        ];
    }

    public toggleDrawer(drawer: DrawerComponent): void {
        drawer.toggle();
    }

    public onSelect(ev: DrawerSelectEvent): void {
        if (ev.item.text === 'התנתק') {
            this.loginService.isHiddenClicked(true);
            this.selected = 'התיק שלי';
        } else {
            this.router.navigate([ev.item.path]);
            this.selected = ev.item.text;
        }
    }
}
