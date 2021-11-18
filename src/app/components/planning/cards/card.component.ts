import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Stock } from 'src/app/models/stock.model';
import { stocks } from 'src/app/resources/stocks';

@Component({
    selector: 'app-card-component',
    templateUrl: './card.component.html',
})
export class CardComponent {
    @Output() public toggleEvents: EventEmitter<Stock> = new EventEmitter();
    isSelected: boolean;
    public cards: Stock[] = stocks;
    formGroup: FormGroup;

    public onCardClick(card: Stock): void {
        this.cards.forEach(card => card.selected = false);
        const currentStock = this.cards.find((stock) => stock.stockId === card.stockId);
        currentStock.selected = !currentStock.selected;
        this.toggleEvents.emit(card);
    }
}
