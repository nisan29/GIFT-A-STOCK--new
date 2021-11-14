import { Component, EventEmitter, Output } from '@angular/core';
import { teams } from 'src/app/resources/teams';
import { securities } from 'src/app/resources/securities';
import { images } from 'src/app/resources/images';
import { Security } from 'src/app/models/security.model';
// import { Team } from 'src/app/models/team.model';

@Component({
    selector: 'app-card-component',
    templateUrl: './card.component.html',
})
export class CardComponent {
    @Output() public toggleEvents: EventEmitter<Security> = new EventEmitter();

    public cards: Security[] = securities.slice(1, 6);

    public images = images;

    // public setCardColor(card: Security): string {
        // const currentTeam = teams.find((team: Team) => team.teamID === card.SecurityId);
        // return currentTeam.teamColor;
    // }

    public onCardClick(card: Security): void {
        const currentEmployee = this.cards.find((security) => security.SecurityId === card.SecurityId);
        currentEmployee.selected = !currentEmployee.selected;
        this.toggleEvents.emit(card);
    }

    // public fetchAvatar(card: Security): string {
    //     const imgURL = `${card.imgId}${card.gender}`;
    //     return this.images[imgURL];
    // }
}
