/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../../typings/bigint/bigint.d.ts"/>

'use strict'

import * as fs from 'fs';
import * as _ from 'lodash';
import * as bigint from 'BigInt';
import {solver} from '../../core/BaseSolver';
import {helper} from '../../core/Helper';

class Hashcode2016round1 extends solver.BaseSolver {

	public nbRows: number;
	public nbColumns: number;
	public nbDrones: number;
	public deadline: number;
	public maximumLoad: number;

	public P: number;
	public productsWeights: Array<number>;

	public W: number;
	public positionsW: Array<Array<number>>;
	public productAvailableByW: Array<Array<number>>;

	public C: number;
	public positionsC: Array<Array<number>>;
	public numberOfOrderedProductsByC: Array<number>;
	public orderedProductsByC: Array<Array<number>>;

	constructor(fileName: string) {
		super(fileName);

		this.readFile();

		this.writer.writeFile();
	}

	readFile(): void {
		[this.nbRows, this.nbColumns, this.nbDrones, this.deadline, this.maximumLoad] = _.map(this.reader.nextLine().split(' '), _.parseInt);

		this.P = _.parseInt(this.reader.nextLine());
		this.productsWeights = _.map(this.reader.nextLine().split(' '), _.parseInt);

		this.W = _.parseInt(this.reader.nextLine());
		this.positionsW = [];
		this.productAvailableByW = [];

		for (let i=0; i<this.W; i++) {
			this.positionsW.push(_.map(this.reader.nextLine().split(' '), _.parseInt));
			this.productAvailableByW.push(_.map(this.reader.nextLine().split(' '), _.parseInt));
		}

		this.C = _.parseInt(this.reader.nextLine());
		this.positionsC = [];
		this.numberOfOrderedProductsByC = [];
		this.orderedProductsByC = [];
		for (let i=0; i<this.C; i++) {
			this.positionsC.push(_.map(this.reader.nextLine().split(' '), _.parseInt));
			this.numberOfOrderedProductsByC.push(_.parseInt(this.reader.nextLine()));
			this.orderedProductsByC.push(_.map(this.reader.nextLine().split(' '), _.parseInt));
		}
	}

	// On passe le warehouse et les cliuents possibles + la charge du drone actulle
	choosenCustomers(wareHouse: number, possibleCustomers: Array<number>): Array<number> {
		// Du plus près au plus loin
		let sortedCustomers = _.sortBy(possibleCustomers, customer => {
			return this.distance(this.positionsW[wareHouse], this.positionsC[customer]);
		});

		// Du plus petit au plus grand
		/*let sortedCustomers = _.sortBy(possibleCustomers, customer => {
			return this.numberOfOrderedProductsByC[customer];
		});*/

		var choosenCustomers = [];
		let weightCustomers = [];
		for (let i=0; i<sortedCustomers.length; i++) {
			let toAdd = 0;
			let customerId = sortedCustomers[i];
			for (let j=0; j<this.numberOfOrderedProductsByC[customerId]; j++) {

				let productId = this.orderedProductsByC[customerId][j];
				toAdd += this.productsWeights[productId];
			}

			// Si c'est trop lourd on arrete tout de suite
			// TODO essayer 2 / 3 cas de plus
			/*if (droneLoad + toAdd > this.maximumLoad) {
				break;
			}*/

			weightCustomers.push([sortedCustomers[i], toAdd]);
		}

		weightCustomers = _.sortBy(weightCustomers, wc => wc[1]);
		choosenCustomers = _.map(weightCustomers, wc => wc[0]);

		// Renvoie la liste des ids des customers triée du plus petit poids restant au plus granbd poids restant
		return choosenCustomers;
	}

	distance(pos0: Array<number>, pos1: Array<number>): number {
		return (pos0[0] - pos1[0]) * (pos0[0] - pos1[0]) + (pos0[1] - pos1[1]) * (pos0[1] - pos1[1]);
	}

	loadProductsInstructions(products: Array<number>, warehouse: number, drone: number) {
		let groups = _.groupBy(products);

		_.forEach(groups, g => {
			this.writer.writeToBuffer(`${drone} L ${warehouse} ${g[0]} ${g.length}`);
		});
	}

	unloadProductsInstructions(products: Array<number>, warehouse: number, drone: number) {
		let groups = _.groupBy(products);

		_.forEach(groups, g => {
			this.writer.writeToBuffer(`${drone} U ${warehouse} ${g[0]} ${g.length}`);
		});
	}

	deliverProduct(drone: number, customerId: number, product: number, numberOfProducts: number) {
		this.writer.writeToBuffer(`${drone} D ${customerId} ${product} ${numberOfProducts}`);
	}

	wait(drone: number, time: number) {
		this.writer.writeToBuffer(`${drone} W ${time}`);
	}

    getWarehousePossibleCustomers(unIndexDeWarehouse){
        let produitsDispo = this.productAvailableByW[unIndexDeWarehouse];
        let indexesOk = [];
        for(let i=0; i < this.C; i++){
            let ok = true;
            let contenuCommande = this.orderedProductsByC[i];
            let nbChaqueElementVoulus = _.groupBy(contenuCommande,function(num){ return (num);});
            for(let unTypeDeProduit in nbChaqueElementVoulus){
                if(produitsDispo[unTypeDeProduit] < nbChaqueElementVoulus[unTypeDeProduit].length){
                    ok = false;
                    break;
                }
            }
            //Si on peut satisfaire la commande i, alors on ajoute cette commande à l'ensemble des commandes satisfables par le DW.
            if(ok){
                indexesOk.push(i);
            }
        }
        return indexesOk;
    }

}

new Hashcode2016round1('practice');
