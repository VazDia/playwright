/**
 * 
 * @author Vazoumana DIARRASSOUBA
 *  Since 04 - 01 - 2024
 */

const xDescription  = "DON - Création d'un bénéficiaire";
const xIdTest       =  71;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'MAGASIN',
    version     : xVersion,        
    refTest     : ['MAG_DON_NEW', 'MAG_DON_BEN', 'MAG_DON_DES'],
    idTest      : xIdTest,
    help        : [],
    params      : ['ville','groupeArticle'],
    fileName    : __filename
};

//----------------------------------------------------------------------------------------

import { test, type Page}               from '@playwright/test';

import { TestFunctions }                from "@helpers/functions";
import { Log }                          from "@helpers/log";
import { Help }                         from '@helpers/helpers';

import { MenuMagasin }                  from '@pom/MAG/menu.page';
import { StockDons }                    from '@pom/MAG/stock-dons.page';
import { StockStock }                   from '@pom/MAG/stock-stock.page';

import { AutoComplete, CartoucheInfo }  from '@commun/types';

//-------------------------------------------------------------------------------------

let page                : Page;

let menu                : MenuMagasin;
let pageStockDons       : StockDons;
let pageStockStock      : StockStock;

const log               = new Log();
const fonction          = new TestFunctions(log);

//----------------------------------------------------------------------------------------

var maDate           = new Date();

const sPoids             = '12.345';
const sPoidsGrammes      = '12345';
const sQuantite          = '8';
const sGroupeArticle2    = 'Marée';
const sCodeBarres        = '2869913027683';


const sVilleCible        = process.env.VILLE || 'Malemort (G914)';
const sGroupeArticle     = process.env.GROUPEARTICLE ||'Fruits et légumes';

//---------------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page            = await browser.newPage(); 
    menu            = new MenuMagasin(page, fonction);
    pageStockDons   = new StockDons(page);
    pageStockStock  = new StockStock(page);
})
 
test.afterAll(async () => {
    await fonction.close();
})

//-----------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.describe ('[' + info.refTest + ']', () => {

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper = new Help(info, testInfo, page);
        await helper.init();
    })

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

    test.describe('Page [STOCK]', async () => {

        var sBeneficiaire : any;
        var sCodeArticle  : any;

        var pageName      = 'stock';

        test('Page [STOCK] - Click', async () => {
            await menu.click(pageName,page);
        })

        test('Label [ERREUR] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
            await fonction.isErrorDisplayed(false, page);
        })   

        test('ListBox [VILLE] = "' + sVilleCible + '"', async () => {
            await menu.selectVille(sVilleCible, page);
        })   

         // Pour selectionner un article pour le don il faut qu'il soit present en stock
        // On selectionnera donc un article après avoir vérifier sa présence en stock
        test.describe('** Recherche d\'article selectionnable pour le don **', () => {

            test('Onglet [STOCK] - Click', async () => {
                await menu.clickOnglet(pageName, 'stock', page);
            })

            test('ListBox [GROUPE ARTICLE / ZONE] = "' + sGroupeArticle + '"', async () => {
                await fonction.listBoxByLabel(pageStockStock.listBoxGroupeArticle, sGroupeArticle, page);
            })

            test('Datagrid Td [CODE ARTICLE][Rnd] - Choose', async () => {
                var iNbArticle = await pageStockStock.tdCodeArticle.count();
                var iCible     = Math.floor(fonction.random()*iNbArticle);
                sCodeArticle   = await pageStockStock.tdCodeArticle.nth(iCible).textContent();
                log.set('Code de l\'article  Donné: ' + sCodeArticle);
            })
        })

        test.describe ('Onglet [DONS]', async () => {

            test('Onglet [DONS] - click', async () => {
                await menu.clickOnglet(pageName, 'dons', page);
            })

            // Selectionner la date du jour pour faciliter la recherche du dond dans la liste
            test('DatePicker [PERIODE DU] = "' + maDate.getDate()+ '"', async () => {
                await pageStockDons.datePickerFromIcon.click();
                var iNbJourActifs = await pageStockDons.datePickerDays.count();
                for (let iIndexJour = 0; iIndexJour < iNbJourActifs; iIndexJour ++){
                    var sJour = await pageStockDons.datePickerDays.nth(iIndexJour).textContent();
                    if(sJour == maDate.getDate().toString()){
                        await pageStockDons.datePickerDays.nth(iIndexJour).click();
                        break;
                    }
                }
            })

            test.describe ('Zone [NOUVEAU DON][1]', async () => {

                test('ListBox [GROUPE ARTICLE][1] = "' + sGroupeArticle + '"', async () => {
                    await fonction.listBoxByLabel(pageStockDons.listBoxGrpArticleNewBenef, sGroupeArticle, page);
                })
    
                test('ListBox [BENEFICIARE][1] - Select', async () => {
                    var iNbOption = await pageStockDons.listBoxBeneficiareOption.count();
                    if(iNbOption > 1){
    
                        sBeneficiaire = await pageStockDons.listBoxBeneficiareOption.nth(1).textContent();
                        log.set('Selected Beneficiaire 1 : ' + sBeneficiaire);
                        sBeneficiaire = sBeneficiaire.replace(/\([^)]*\)/g, ''); // En cas de parenthèse dans le texte, sa recherche devient difficile. Donc il faut pour la suite l'enlever
                        await pageStockDons.listBoxBeneficiare.selectOption({index:1});
                    }                    
                })  

                test('InputField [CODE BARRES][1] = "' + sCodeBarres + '"', async () => {
                    var isEnabled = await pageStockDons.inputCodeBarre.isEditable();
                    if(isEnabled){

                        await fonction.sendKeys(pageStockDons.inputCodeBarre, sCodeBarres);
                    }else{
                        log.set('InputField [CODE BARRES][1] = "' + sCodeBarres + '" : ACTION ANNULEE');
                        test.skip();
                    }
                })

                test('InputField [AUTOCOMPLETE][ARTICLE][1] = "Selected Article"', async () => {
                    var isVisible = await pageStockDons.inputArticle.isVisible();
                    var isEnabled = await pageStockDons.inputArticle.isEditable();
                    if(isVisible && isEnabled){

                        var oData:AutoComplete = {
                            libelle         :'ARTICLE',
                            inputLocator    : pageStockDons.inputArticle,
                            inputValue      : sCodeArticle,
                            choiceSelector  :'li.gfit-autocomplete-result',
                            choicePosition  : 0,
                            typingDelay     : 100,
                            waitBefore      : 500,
                            page            : page,
                        };
                        await fonction.autoComplete(oData);
                        var article = await pageStockDons.inputArticle.inputValue();
                        log.set('Selected Article : ' + article);
                    }else{
                        log.set('InputField [AUTOCOMPLETE][ARTICLE][1] = "Selected Article" : ACTION ANNULEE');
                        test.skip();
                    }
                })
            
                test('InputField [QUANTITE][1] = "' + sQuantite + '"', async () => {
                    var isVisible = await pageStockDons.inputQuantite.isVisible();
                    var isEnabled = await pageStockDons.inputQuantite.isEnabled();
                    if(isVisible && isEnabled){

                        await fonction.sendKeys(pageStockDons.inputQuantite,sQuantite);
                    }else{

                        log.set('InputField [QUANTITE][1] = "' + sQuantite + '" : ACTION ANNULEE');
                        test.skip();
                    }
                }) 

                test('InputField [POIDS][1] = "' + sPoids + '"', async () => {
                    var isVisible = await pageStockDons.inputPoids.isVisible();
                    var isEnabled = await pageStockDons.inputPoids.isEnabled();
                    if(isVisible && isEnabled){

                        await fonction.sendKeys(pageStockDons.inputPoids, sPoids);
                        log.set('Poids don 1: ' + sPoids);  
                    }                  
                })        
                
                test('Button [AJOUTER][1] - Click', async () => {
                    var isVisible = await pageStockDons.buttonAjouterDon.isVisible();
                    var isEnabled = await pageStockDons.buttonAjouterDon.isEnabled();
                    if(isVisible && isEnabled){

                        await fonction.clickAndWait(pageStockDons.buttonAjouterDon, page);
                    }else{
                       log.set('Button [AJOUTER] - Click : ACTION ANNULEE');
                       test.skip(); 
                    }
                })  
                
                test('Label [ERREUR][1] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                    await fonction.isErrorDisplayed(false, page);
                })  
            })      
            
            test.describe ('Zone [RESULTS][1]', async () => {
    
                test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle + '"', async () => {
                    await fonction.listBoxByLabel(pageStockDons.listBoxGrpArticle, sGroupeArticle, page);
                })
        
                test('InputField [BENEFICIAIRE] = " Selected Beneficiaire 1"', async () => {
                    await fonction.sendKeys(pageStockDons.inputBeneficiare, sBeneficiaire);              
                })
        
                test('CheckBox [*Last Response*][1] - Click', async () => {
                    var isVisible = await pageStockDons.checkBoxResponse.last().isVisible();
                    if(isVisible){

                        await pageStockDons.checkBoxResponse.last().click();  
                    }else{
                        log.set('CheckBox [*Last Response*] - Click : ACTION ANNULEE');
                        test.skip();
                    }   
                }) 
        
                test('Button [IMPRIMER LE BON DE REMISE DE DONS ] - Click', async () => {
                    await fonction.noHtmlInNewTab(page, pageStockDons.buttonImprimerBonRemise);           
                })
            })
    
            var sNomPopin = 'Imprimer un récapitulatif mensuel'
            test.describe('Popin [' + sNomPopin.toUpperCase() + ']', () => {

                test('Button [IMPRIME RUN RECAPITTULATIF MENSUEL] - Click', async () => {
                    await fonction.clickAndWait(pageStockDons.buttonImprimRecap, page);
                })
                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, true);
                })

                test('ListBox [SOCIETE][FIRST] - Click', async () => {
                    await pageStockDons.pPInputSociete.selectOption({index:0});
                })

                test('Button [IMPRIMER] - Click', async () => {
                    await fonction.noHtmlInNewTab(page, pageStockDons.pPButtonImprimer);
                })

                test('Popin [' + sNomPopin.toUpperCase() + '] - Is Not Visible', async () => {
                    await fonction.popinVisible(page, sNomPopin, false);
                })
            })

            test.describe ('Zone [NOUVEAU DON][2]', async () =>  {
    
                test('ListBox [GROUPE ARTICLE][2] = "' + sGroupeArticle2 + '"', async () =>  {
                    await fonction.listBoxByLabel(pageStockDons.listBoxGrpArticleNewBenef, sGroupeArticle2, page);
                })
        
                test('ListBox [BENEFICIAIRE][2] - Select', async () =>  {
                    var nbOption = await pageStockDons.listBoxBeneficiareOption.count();
                    if(nbOption > 1){
                        sBeneficiaire = await pageStockDons.listBoxBeneficiareOption.nth(1).textContent();
                        log.set('Selected Beneficiaire 2 :' + sBeneficiaire);
                        sBeneficiaire = sBeneficiaire.replace(/\([^)]*\)/g, '');  // En cas de parenthèse dans le texte, sa recherche devient difficile. Donc il faut pour la suite l'enlever
                        await pageStockDons.listBoxBeneficiare.selectOption({index:1});
                    } 
                })
    
                test('InputField [CODE BARRES][2] = "' + sCodeBarres + '"', async () => {
                    var isEnabled = await pageStockDons.inputCodeBarre.isEditable();
                    if(isEnabled){

                        await fonction.sendKeys(pageStockDons.inputCodeBarre, sCodeBarres);
                    }else{
                        log.set('InputField [CODE BARRES][2] = "' + sCodeBarres + '" : ACTION ANNULEE');
                        test.skip();
                    }
                })

                test('InputField [AUTOCOMPLETE][ARTICLE][2] = "Selected Article"', async () => {
                    var isVisible = await pageStockDons.inputArticle.isVisible();
                    var isEnabled = await pageStockDons.inputArticle.isEditable();
                    if(isVisible && isEnabled){

                        var oData:AutoComplete = {
                            libelle         :'ARTICLE',
                            inputLocator    : pageStockDons.inputArticle,
                            inputValue      : sCodeArticle,
                            choiceSelector  :'li.gfit-autocomplete-result',
                            choicePosition  : 0,
                            typingDelay     : 100,
                            waitBefore      : 500,
                            page            : page,
                        };
                        await fonction.autoComplete(oData);
                        var article = await pageStockDons.inputArticle.inputValue();
                        log.set('Selected Article 2 : ' + article);
                    }else{
                        log.set('InputField [AUTOCOMPLETE][ARTICLE][2] = "Selected Article" : ACTION ANNULEE');
                        test.skip();
                    }
                })
        
                test('InputField [QUANTITE][2] = "' + sQuantite + '"', async () => {
                    var isVisible = await pageStockDons.inputQuantite.isVisible();
                    var isEnabled = await pageStockDons.inputQuantite.isEnabled();
                    if(isVisible && isEnabled){

                        await fonction.sendKeys(pageStockDons.inputQuantite,sQuantite);
                    }else{

                        log.set('InputField [QUANTITE][2] = "' + sQuantite + '" : ACTION ANNULEE');
                        test.skip();
                    }
                })                     
        
                test('InputField [POIDS][2] = "' + sPoidsGrammes + '"', async () => {
                    var isEnabled = await pageStockDons.inputPoids.isEnabled();
                    if(isEnabled){

                        await fonction.sendKeys(pageStockDons.inputPoids, sPoidsGrammes);
                        log.set('Poids don 2 : ' + sPoidsGrammes +  ' gramme');
                    }else{

                        log.set('InputField [POIDS][2] = "' + sPoidsGrammes + '" : ACTION ANNULEE');
                        test.skip();
                    }                 
                })  
        
                test('Button [AJOUTER][2] - Click', async () => {
                    var isVisible = await pageStockDons.buttonAjouterDon.isVisible();
                    var isEnabled = await pageStockDons.buttonAjouterDon.isEnabled();
                    if(isVisible && isEnabled){

                        await fonction.clickAndWait(pageStockDons.buttonAjouterDon, page);
                    }else{

                        log.set('Button [AJOUTER][2] - Click : ACTION ANNULEE');
                        test.skip();
                    }
                })
                
                test('Label [ERREUR][2] - Is Not Visible', async () => {   // Pas d'erreur affichée à priori au chargement de la page
                    await fonction.isErrorDisplayed(false, page);
                })  
            }) 
    
            test.describe ('Zone [RESULTS][2]', async () => {
        
                test('ListBox [GROUPE ARTICLE] = "' + sGroupeArticle2 + '"', async () => {
                    await fonction.listBoxByLabel(pageStockDons.listBoxGrpArticle, sGroupeArticle2, page);
                })
        
                test('InputField [BENEFICIAIRE] = "Selected Beneficiaire 2"', async () => {
                    await fonction.sendKeys(pageStockDons.inputBeneficiare, sBeneficiaire);               
                })
        
                test('CheckBox [*Last Response*][2] - Click', async () => {
                    var isVisible = await pageStockDons.checkBoxResponse.last().isVisible();
                    if(isVisible){

                        await pageStockDons.checkBoxResponse.last().click();  
                    }else{
                        
                        log.set('CheckBox [*Last Response*][2] - Click : ACTION ANNULEE');
                        test.skip();
                    }                    
                })
            })
        })
    })
})