/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 19 - 12 - 2023
 */

const xRefTest      = "MAG_ENG_NEW";
const xDescription  = "Création d'un Engagement";
const xIdTest       =  978;
const xVersion      = '3.3';

var info:CartoucheInfo = {
	desc        : xDescription,
	appli       : 'MAGASIN',
	version     : xVersion,        
	refTest     : [xRefTest],
	idTest      : xIdTest,
	help        : [],
	params      : ['groupeArticle'],
	fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}                from '@playwright/test';

import { TestFunctions }                 from "@helpers/functions";
import { Log }                           from "@helpers/log";
import { Help }                          from '@helpers/helpers';

//-- PageObject ----------------------------------------------------------------------

import { MenuMagasin }                   from '@pom/MAG/menu.page';
import { AutorisationsParametrage }      from '@pom/MAG/autorisations-parametrage.page';
import { AutorisationsAchatsCentrale }   from '@pom/MAG/autorisations-achats_centrale.page';

import { CartoucheInfo }                 from '@commun/types';
//-------------------------------------------------------------------------------------

let page          : Page;

let menu          : MenuMagasin;
let pageAutParam  : AutorisationsParametrage;
let pageAutoAC    : AutorisationsAchatsCentrale;

const log         = new Log();
const fonction    = new TestFunctions(log);

//----------------------------------------------------------------------------------------

// Attention : Doit porter le même nom que le Test "creation_modele_commande.spec.js"
const sNomEngagement    = 'TEST-AUTO_engagement-' + fonction.getToday('FR');
// Timing
const sHeureDebut       = '23';
const sMinuteDebut      = '58';
const sHeureFin         = '23';
const sMinuteFin        = '59';

const sGroupeArticle    = fonction.getInitParam('groupeArticle','Fruits et légumes');

//-----------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
	page            = await browser.newPage(); 
	menu            = new MenuMagasin(page, fonction);
	pageAutParam    = new AutorisationsParametrage(page);
	pageAutoAC      = new AutorisationsAchatsCentrale(page);
})
 
test.afterAll(async () => {
	await fonction.close();
})

//-----------------------------------------------------------------------------------------

test.describe.serial('[' + xRefTest + ']', () => {

	test('-- Start --', async ({ context }, testInfo) => {
		await context.clearCookies();
		const helper = new Help(info, testInfo, page);
		await helper.init();
	});

	test('Ouverture URL', async() => {
		await fonction.openUrl(page);
	})

	test('Connexion', async () => {
		await fonction.connexion(page);
	})

	test.describe('Page [ACCUEIL]', async () => {

		test('Link [BROWSER SECURITY WARNING] - Click', async () => {
			await fonction.waitTillHTMLRendered(page);
			var isVisible = await menu.pPopinAlerteSanitaire.isVisible();
			if(isVisible){

				await menu.removeArlerteMessage();
			}else{
				
				log.set('Link [BROWSER SECURITY WARNING] - Click : ACTION ANNULEE');
				test.skip();
			}
		})
	})

	test.describe('Page [AUTORISATIONS]', async () => {

		var bEngagemtnExiste = false;
		var pageName         = 'autorisations';

		test('Page [AUTORISATIONS] - Click', async () => {
			await menu.click(pageName,page);
		})

		test('Label [ERREUR][0] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
			await fonction.isErrorDisplayed(false, page);
		})                            
		
		test.describe('*** VERIFICATION DE L\'EXISTENCE DE L\'ASSORTIMENT ', () => {

			test('Onglet [ENGAGEMENTS] - Click', async () => {
				await menu.clickOnglet(pageName, 'engagements', page);
			})

			test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"' , async () =>{
				await pageAutoAC.listBoxGroupeArticle.click();
				await fonction.sendKeys(pageAutoAC.listBoxGrpeArtInput, sGroupeArticle);
				await fonction.clickElement(pageAutoAC.listBoxGrpeArtItem.nth(0));
				// Verifier si la listBox est encore ouverte
				var isVisibleListBoxICon = await pageAutoAC.listBoxGrpeArtIcon.isVisible();
				if(isVisibleListBoxICon){
					await fonction.clickElement(pageAutoAC.listBoxGrpeArtIcon);
				}
			})
			test('InpuField [ASSORTIMENT] = "' + sNomEngagement + '"', async () =>{
				await fonction.sendKeys(pageAutoAC.inputAssortiment, sNomEngagement);
			})

			test('Tr [ASSORTIMENT] = "' + sNomEngagement + '" - Check', async () => {
				await fonction.wait(page,1000);
				var isVisible = await pageAutoAC.trAssortimentParRech.last().isVisible();
				if(isVisible){

					var iNbAssortiments = await pageAutoAC.trAssortimentParRech.count();
					console.log('iNbAssortiments : ' + iNbAssortiments)
					for(let iCible = 0; iCible < iNbAssortiments; iCible ++ ){

						var assortiment = await pageAutoAC.trAssortimentParRech.nth(iCible).textContent();
						if(assortiment?.match(sNomEngagement)){

							bEngagemtnExiste = true;
							break;
						}
					}
				}
				log.set(' ------------------  VERIFICATION DE L\'EXISTENCE DE L\'ENGAGEMENT  --------------');
				if (bEngagemtnExiste) {

					throw new Error('L\'engagement "' + sNomEngagement + '" existe déjà');
				}else{

					log.set('Aucun Engagement correspond à "' + sNomEngagement + '"');
				}
				log.separateur();
			})
		})

		test.describe('Onglet [PARAMETRAGE]', async () => {     

			test('Onglet [PARAMETRAGE] - Click', async () => {   
				await menu.clickOnglet(pageName, 'parametrage', page);
			})

			test('Label [ERREUR][1] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
				await fonction.isErrorDisplayed(false, page);
			})                            
  
			test('Button [CREER ASSORTIMENT] - Click', async () => {
				await fonction.clickAndWait(pageAutParam.buttonCreerAssort, page);   
			})                

			test('Radio Button [ENGAGEMENT] - Click', async () =>{
				await fonction.clickElement(pageAutParam.radioButtonEngagement);
			})
  
			test('ListBox [GROUPE] = "' + sGroupeArticle + '"', async () => {
				await fonction.listBoxByLabel(pageAutParam.listBoxOrigine, sGroupeArticle, page);
			})

			test('InputField [DESIGNATION] = "' + sNomEngagement + '"', async () => {
				await fonction.sendKeys(pageAutParam.inputDesignation, sNomEngagement); 
			})

			test('CheckBox [COMMANDES FERMES] - Click', async () => {
				await fonction.clickElement(pageAutParam.checkBoxCommandesFermes);
			})

			test('CheckBox [ENGAGEMENT PRIORITAIRE SUR COMMANDE] - UnClick', async () => {
				await fonction.clickElement(pageAutParam.checkBoxEngPrioSurCmd); 
			})            

			test('DatePicker [DEBUT][LAST DAY] - Click', async () => {
				await fonction.clickElement(pageAutParam.datePickerDebutEng);
				await fonction.clickElement(pageAutParam.datePickerDay.last()); 
			})

			test('DatePicker [FIN][LAST DAY] - Click', async () => {
				await fonction.clickElement(pageAutParam.datePickerFinEng);
				await fonction.clickElement(pageAutParam.datePickerDay.last()); 
			})            

			test('InputField [HEURE DEBUT] = "' + sHeureDebut + '"', async () => {
				await fonction.sendKeys(pageAutParam.inputHeureDebut,  sHeureDebut);
			})
  
			test('InputField [MINUTE DEBUT] = "' + sMinuteDebut + '"', async () => {
				await fonction.sendKeys(pageAutParam.inputMinuteDebut, sMinuteDebut); 
			})
	   
			test('InputField [HEURE FIN] = "' + sHeureFin + '"', async () => {
				await fonction.sendKeys(pageAutParam.inputHeureFin,    sHeureFin);  
			})

			test('InputField [MINUTE FIN] = "' + sMinuteFin + '"', async () => {
				await fonction.sendKeys(pageAutParam.inputMinuteFin,   sMinuteFin);  
			})
				 
			test('Button [ENREGISTRER] - Click', async () => {
				await fonction.clickAndWait(pageAutParam.buttonEnregistrer, page);
				log.set('L\' opération a été effectuée avec succès : l\'engement est maintenant créé');     
			})        

			test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
				await fonction.isErrorDisplayed(false, page); 
			})                            
		})  // En describe Onglet
	}) // end describe Page

	test('Déconnexion', async () => {
		await fonction.deconnexion(page);
	})
})