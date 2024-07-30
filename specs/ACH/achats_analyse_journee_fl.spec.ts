/**
 * 
 * @author SIAKA KONE
 * @since 2024-07-08
 * 
 */
const xRefTest      = "ACH_FL1_ART";
const xDescription  = "Effectuer un achat Fruits et Légumes (FL) (Analyse journée)";
const xIdTest       =  21; 
const xVersion      = '3.7';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'ACHATS',
    version     : xVersion,    
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : ['fournisseur','plateformeReception','plateformeDistribution','listeArticles','listeMagasins','nbColisEstimes','rayon','dossierAchat'],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { expect, test, type Page }  from '@playwright/test';

import { Help }             from '@helpers/helpers.js';
import { TestFunctions }    from '@helpers/functions.js';
import { EsbFunctions }     from '@helpers/esb.js';
import { Log }              from '@helpers/log.js';

import { PageAchAnalyse }   from '@pom/ACH/achats_analyse-journee.page.js';
import { PageAchAchFour }   from '@pom/ACH/achats_achats-fournisseurs.page.js';
import { MenuAchats }       from '@pom/ACH/menu.page.js';

import { CartoucheInfo, TypeEsb } from '@commun/types';
//------------------------------------------------------------------------------------

let page                     : Page;
let pageAchAnalyse           : PageAchAnalyse;
let pageAchAchFour           : PageAchAchFour;
let menu                     : MenuAchats;
let esb                      : EsbFunctions;

const log            = new Log();
const fonction       = new TestFunctions(log);
//------------------------------------------------------------------------------------
fonction.importJdd(); //Import du JDD pour le bout en bout  
//------------------------------------------------------------------------------------
const sFournisseur      = fonction.getInitParam('fournisseur', 'Cooplim'); // L\'atelier des fruits et legumes  Sicodis
const sPtfDistribut     = fonction.getInitParam('plateformeDistribution', 'Chaponnay');
var sNbColis            = fonction.getInitParam('nbColisEstimes', '10');
const sPtfReception     = fonction.getInitParam('plateformeReception', 'Chaponnay');
const sRayon            = fonction.getInitParam('rayon', 'Fruits et légumes');
const aCodeArticles     = fonction.getInitParam('listeArticles', '7417');//5443,8195,8610 //5600 5402
var aListeMagasins      = fonction.getInitParam('listeMagasins', 'Bergerac,Bron');
const sDossierAchat     = fonction.getInitParam('dossierAchat');

const maDate = new Date();

const sUniteAchat       = 'Colis';
const rPrixTransport    = 1.000;
var sIncoterm           = '';

var   aCodesArticles    = aCodeArticles.split(',');
var iNbMagasin = aListeMagasins.length;

if(iNbMagasin > 0){
    sNbColis = (parseInt(sNbColis)*iNbMagasin).toString();
}

if(sPtfReception == sPtfDistribut){
    sIncoterm = 'D - Départ exp.';
} else {
    sIncoterm = 'P - Départ PF';
}

test.beforeAll(async ({ browser }, testInfo) => {

    page            = await browser.newPage();
    menu            = new MenuAchats(page, fonction);
    pageAchAnalyse  = new PageAchAnalyse(page);
    pageAchAchFour  = new PageAchAchFour(page);
    esb             = new EsbFunctions(fonction);
    const helper    = new Help(info, testInfo, page);
    await helper.init();
})

test.afterAll(async () => {
    await fonction.close();
})

test.describe.serial('[' + xRefTest + '] - ' + xDescription + ' : ', () => {

    fonction.importJdd();

    var oData = {
        aLots           : {},
        sNumAchat       : '',
        sNumAchatLong   : '',
        sBonLivraison   : '',
        aFeuille        : {},
        aCalibre        : {},
        aConditionnement: {},
    };

    test ('Ouverture URL : ' + fonction.getApplicationUrl(), async ({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    })

    test('Connexion', async () => {
        await fonction.connexion(page);
        log.set('Nombre de magasin : ' + iNbMagasin);
    })
  
    test.describe('Page [ACHATS]', async () => {

        test('ListBox [RAYON] ="' + sRayon + '"', async() => {
            await menu.selectRayonByName(sRayon, page);
        })

        var pageName:string = 'achats';
        test('Page [ACHATS] - Click', async () => {
            await menu.click(pageName, page);
        })

        var sNomOnglet:string = "ANALYSE JOURNEE";
        test.describe('Onglet [' + sNomOnglet.toUpperCase() + ']', async () => {

           test('Onglet [' + sNomOnglet + '] - Check', async () => {
                await menu.isOngletPresent('Analyse journée');        
            })
            
            test('Date expedition magasin - Check', async () => {
                const sDateExp:string = fonction.addZero(maDate.getDate()) + ' / ' + fonction.addZero(maDate.getMonth() + 1) + ' / ' + fonction.addZero(maDate.getFullYear());
                const sDateExpe:string = await pageAchAnalyse.inputDateExpeMag.inputValue();
                expect(sDateExpe).toContain(sDateExp);
            })

            test('ListBox [DOSSIER D\'ACHAT] = "' + sDossierAchat + '"', async () =>{
                if (process.env.E2E == 'E2E_NEW_FRN') {
                    log.set('Dossier choisi par défaut : ' + sDossierAchat);
                } else {
                    await fonction.clickElement(pageAchAnalyse.listBoxDossierAchat);
                    await fonction.clickElement(pageAchAnalyse.listBoxDossierAchatItem.filter({hasText:sDossierAchat}));
                }
            })

            test('ListBox [PLATEFORME DE RECEPTION] - Click', async () => {
                await fonction.clickElement(pageAchAnalyse.selectBoxPlateforme);
            })

            test('InputField [PLATEFORME DE RECEPTION] = "' + sPtfReception + '"', async () => {
                await fonction.sendKeys(pageAchAnalyse.inputFiltrePlateforme, sPtfReception);
            })

            test('CheckBox [PLATEFORME DE RECEPTION][0] = "' + sPtfReception + '"', async () => {
                await fonction.clickElement(pageAchAnalyse.listBoxPlateforme.filter({hasText:sPtfReception}).nth(0));
            })

            test('Close [X] - Click', async () => {
                await fonction.clickElement(pageAchAnalyse.closeListePlateforme);
            })

            test('Check [NOMBRE ARTCLE DU DOSSIER]  - Count', async ()=> {
                if(process.env.user == 'jcc-recette1') { //On veut s'assurer qu'il n'y a que les articles du dossier d'achat associer au user Acheteur
                    await fonction.wait(page, 500);
                    const iNbreArticleDossier:number = await pageAchAnalyse.tdListeAchat.count();
                    expect(iNbreArticleDossier).toBe(aCodesArticles.length);//aCodesArticles.length
                } else {
                    test.skip();
                }
            })

            test.skip('CheckBox [AFFICHER TOUS LES ARTICLES] - Click ', async () => {
                await pageAchAnalyse.buttonParametrage.hover();
                await fonction.clickAndWait(pageAchAnalyse.switchButton, page);
            })

            aCodesArticles.forEach(async (sArticle:string) =>{

                test('InputField [CODE] = "' + sArticle + '"', async () => {
                    await fonction.sendKeys(pageAchAnalyse.inputFiltreIdArticle, sArticle);
                    await fonction.wait(page, 500);
                })
    
                test('td [ARTICLE A ACHETER][0][' + sArticle + ']  - Click', async ()=> {
                    await fonction.clickElement(pageAchAnalyse.tdListeAchat.nth(0));
                })
    
                test('Button [MODIFIER][' + sArticle + ']  - Click',async () => {
                    await fonction.clickAndWait(pageAchAnalyse.buttonModifier, page);
                })

                var sNomPopin:string = "Detail achat";
                test.describe('Popin [' + sNomPopin.toUpperCase() + '][' + sArticle + ']', async () => {

                    test('Popin [' + sNomPopin.toUpperCase() + '] - Is Visible', async () => {
                        await fonction.popinVisible(page, sNomPopin, true);
                    })

                    test('Check Date', async () => {
                        const sDateJour:string = fonction.addZero(maDate.getDate()) + ' / ' + fonction.addZero(maDate.getMonth() + 1);
                        const sDatePrepa:string = await pageAchAnalyse.datePreparation.textContent();
                        expect(sDatePrepa).toContain(sDateJour);
                    })

                    test('Check Plateforme Reception', async () => {
                        const currentPltDist = pageAchAnalyse.pPButtoncurrentPltfDistri.filter({hasText:sPtfDistribut});//  sPtfDistribut
                        await expect(currentPltDist).toHaveClass("p-element p-button p-component ng-star-inserted");
                        await fonction.clickElement(currentPltDist);
                        await fonction.wait(page, 1000);
                    })

                    test('InputField [COLIS ESTIME] = "' + sNbColis + '"', async () => {
                        await pageAchAnalyse.pPdetailtdLigneAchat.first().waitFor();
                        //Selectionner la ligne
                        const tdFournisseur = pageAchAnalyse.pPdetailtdLigneAchat.filter({hasText:sFournisseur});
                        const bEnabled:boolean = await tdFournisseur.nth(0).locator('input[formcontrolname="estimeColis"]').isEnabled();
                        if(bEnabled) {
                            await fonction.sendKeys(tdFournisseur.nth(0).locator('input[formcontrolname="estimeColis"]'), sNbColis, false);
                        } else {
                            await fonction.sendKeys(tdFournisseur.nth(1).locator('input[formcontrolname="estimeColis"]'), sNbColis, false);
                        }
                    })

                    test.skip('InputField [ESTIME PALETTE] = "' + sNbColis + '"', async () => {
                        //Selectionner la ligne
                        const tdFournisseur = pageAchAnalyse.pPdetailtdLigneAchat.filter({hasText:sFournisseur});
                        const sPaletteStime = await tdFournisseur.nth(0).locator('input[formcontrolname="estimePalette"]').inputValue();
                        expect(sPaletteStime).not.toBeNull();
                        const sPrixAchat = await tdFournisseur.nth(0).locator('input[formcontrolname="prixAchat"]').inputValue();
                        expect(sPrixAchat).not.toBeNull();
                        log.set('Prix achat : ' + sPrixAchat);
                    })

                    test.skip('InputField [PRIX ACHAT] - Check', async () => {
                        //Selectionner la ligne
                        const tdFournisseur = pageAchAnalyse.pPdetailtdLigneAchat.filter({hasText:sFournisseur});
                        await fonction.sendKeys(tdFournisseur.nth(0).locator('input[formcontrolname="prixAchat"]'), 1);
                        //expect(sPaletteStime).not.toBeNull();
                    })

                    test('Button [ENREGISTRER][' + sArticle + '] - Click', async () => {
                        test.setTimeout(180000); 
                        await pageAchAnalyse.pPdetailButtonEnregistrers.waitFor({state:"visible"});
                        await fonction.clickAndWait(pageAchAnalyse.pPdetailButtonEnregistrers, page);
                    })

                    test('Button [MODIFIER][' + sArticle + '] - Click',async () => {
                        test.setTimeout(180000);                                            // Augmentation du délai du test car > au délai global défini (42 sec)
                        await pageAchAnalyse.buttonModifier.waitFor({state:"visible"});
                        await fonction.clickAndWait(pageAchAnalyse.buttonModifier,page,60000);
                    })

                    test('Label [NUMERO ACHAT && LOT][' + sArticle + ']', async () => {
                        await pageAchAnalyse.pPdetailtdLigneAchat.first().waitFor();
                        const tdFournisseur = pageAchAnalyse.pPdetailtdLigneAchat.filter({hasText:sFournisseur});
                        const numAchat = await tdFournisseur.nth(0).locator('td.text-center:nth-child(2)').textContent();
                        const numLot = await tdFournisseur.nth(0).locator('td.text-center:nth-child(18)').textContent();
                        oData.aLots[sArticle] = numLot;
                        if(aCodesArticles.indexOf(sArticle) == 0){
                            oData.sNumAchat= numAchat;
                            log.set('Numéro achat : ' +numAchat);
                        } else {
                            expect(numAchat).toBe(oData.sNumAchat);
                        }
                    })
    
                    test('Button [FERMER] - Click', async ()=>{
                        await fonction.clickAndWait(pageAchAnalyse.pPdetailButtonFermer, page);
                    })

                })
            });

        })

        var sNomOnglet:string = "ACHATS AUX FOURNISSEURS";
        test.describe('Onglet [' + sNomOnglet +']', async () => {

            test('Onglet [' + sNomOnglet.toUpperCase() + '] - Click', async () => {
                await menu.clickOnglet(pageName, 'achatsAuxFournisseurs', page);
            })

            test('InputField [NUMERO ACHAT] = "' + oData.sNumAchat + '"', async ()=> {
                await pageAchAchFour.fAcheterInputNumAchat.first().waitFor();
                await fonction.sendKeys(pageAchAchFour.fAcheterInputNumAchat, oData.sNumAchat.trim());
                await fonction.wait(page, 500);
            })

            const sStatut:string = 'A effectuer';
            test('Label [STAUT] = "'+sStatut+'" - Check', async () => {
                const sStatutAch:string = await pageAchAchFour.tdStatutAchat.textContent();
                expect(sStatutAch).toBe(sStatut);
            })

            test('td [ARTICLE A ACHETER][0] - Click', async () => {
                await fonction.clickElement(pageAchAchFour.tdListAchat.nth(0));
            })

            test('Button [MODIFIER] - Click', async () => {
                await fonction.clickAndWait(pageAchAnalyse.buttonModifier, page);
            })

            test('Input [ACHETEUR] - Check', async () => {
                const bEnabled = await pageAchAchFour.inputAcheteur.isEditable();
                expect(bEnabled).not.toBe(true);
            })

            test('Get Numero Long Achat', async () => {
                const numAchatL = await pageAchAnalyse.labelNumAchat.textContent();
                oData.sNumAchatLong = numAchatL;
                log.set('Numero d\'achat long : ' + numAchatL);
            })
            
            aCodesArticles.forEach(async (sCodeArticle:string) => {
                test('Input [CODE ARTICLE][' + sCodeArticle + '] = "' + sCodeArticle + '"',async () => {
                    await fonction.sendKeys(pageAchAchFour.pPinputFiltreCodeArticle, sCodeArticle);
                    await fonction.wait(page, 1000);//Attendre que le filtre soit effectif;
                })

                test ('ListBox [ORIGINEE][0]['+ sCodeArticle + ']', async () => {
                    await fonction.clickElement(pageAchAchFour.fAcheterListBoxOrigine.nth(0));
                    const iNbreElmt = await pageAchAchFour.listBoxVarie.count();
                    if(iNbreElmt > 0){
                        await pageAchAchFour.listBoxVarie.nth(0).click();
                        await fonction.wait(page, 1000);
                    } else {
                        log.set("Origne déjà utilisé et grisé " + iNbreElmt);
                        test.skip();
                    }
                });

                test('Check Qte Lot[' + sCodeArticle + ']', async () => {
                    const sNbreLot:string = await pageAchAchFour.inputColisEstime.inputValue();
                    expect(sNbreLot).toBe(sNbColis);
                })
    
                test('ListBox [PLATEFORME DISTRIBUTION][' + sCodeArticle + '] = "' + sPtfDistribut + '"', async () => {
                    await fonction.clickElement(pageAchAchFour.listBoxPtfDistribution);
                    await fonction.clickElement(pageAchAchFour.listBoxVarie.filter({hasText:sPtfDistribut}).nth(0));
                })
    
                test('ListBox [INCOTERM][' + sCodeArticle + '] = "' + sIncoterm + '"', async () => {
                    await fonction.clickElement(pageAchAchFour.fAcheterListBoxIncoterm);
                    await fonction.clickElement(pageAchAchFour.listBoxVarie.filter({hasText:sIncoterm}).nth(0));
                })
    
                test('ListBox [PRIX ACHAT EN][' + sCodeArticle + '] = "'+ sUniteAchat +'"', async () =>{
                    await fonction.clickElement(pageAchAchFour.fAcheterListBoxUniteAchat);
                    await fonction.clickElement(pageAchAchFour.listBoxVarie.filter({hasText:sUniteAchat}).nth(0));
                })
            });

            test('Button [BASCULER COLIS ESTIME] - Click', async () => { 
                await fonction.clickElement(pageAchAchFour.pPbuttonBasculerColisEst);
            })

            test('Colis acheté [NUMERO LOT] - Check', async () => {
                const sQteAchete:string = await pageAchAchFour.tdNumeroLotAchete.inputValue();
                expect(sQteAchete).toBe(sNbColis);
            })

            test('Button [ENREGISTRER] - Check',async ()=>{
                const bEnabled:boolean = await pageAchAchFour.fAcheterbuttonEnregistrer.isEnabled();
                expect(bEnabled).toBe(true);
            })

            test('Button [ACHETER] - Click',async ()=>{
                await fonction.clickAndWait(pageAchAchFour.buttonAchater, page);
            })

            test('Confirmation [ACHETER] - Click if present', async () => {
                var isElementVisible:boolean = await pageAchAchFour.pPconfirmButtonAcheter.isVisible();
                test.setTimeout(60000);
                if(isElementVisible){
                    await fonction.clickAndWait(pageAchAchFour.pPconfirmButtonAcheter, page,6000);
                    log.set('Confirmation d\'achat malgré alerte');
                }else{
                    test.skip();
                }
            })

            const sStatuAch:string = 'A confirmer';
            test('Label [STAUT] = "'+sStatut+'" # 1 - Check', async () => {
                test.setTimeout(180000);//La durée du chargement de la page étant un peu longue;
                await expect(pageAchAchFour.spinnerLoading.first()).not.toBeVisible({timeout:180000});
                const sStatutAch:string = await pageAchAchFour.tdStatutAchat.nth(0).textContent();
                expect(sStatutAch).toBe(sStatuAch);
            })

            test('Button [ENREGISTRER] #1 - Check',async ()=> {
                const bDisabled:boolean = await pageAchAchFour.fAcheterbuttonEnregistrer.isDisabled();
                expect(bDisabled).toBe(true);
            })

            test('Check alerte', async () => {
                const sMessAlerte1:string = "Attention ! Le changement d'incoterm du lot";
                const sMessAlerte2:string = "nécessite que le prix de transport soit renseigné dans la saisie du lot.";
                if(sPtfReception == sPtfDistribut) {
                    const sAlert:string = await pageAchAchFour.labelAlerte.textContent();
                    expect(sAlert).toContain(sMessAlerte1);
                    expect(sAlert).toContain(sMessAlerte2);
                }
            })

            test.skip('Button [ACHETER] #1 - Check',async ()=> {
                const bDisabled:boolean = await pageAchAchFour.buttonAchater.isDisabled();
                expect(bDisabled).toBe(true);
            })

            test('Button [CONFIRMETR] #1 - Check', async () => {
                const bDisabled:boolean = await pageAchAchFour.buttonConfirmerAchat.isDisabled();
                expect(bDisabled).toBe(true);
            })

            aCodesArticles.forEach(async (sCodeArticle:string) => {
                test.describe('Popin [DETAIL LOTS][' + sCodeArticle + ']', async () => {

                    test('Input [CODE ARTICLE] = "' + sCodeArticle + '"',async () => {
                        await fonction.sendKeys(pageAchAchFour.pPinputFiltreCodeArticle, sCodeArticle);
                        await fonction.wait(page, 500);
                    })

                    test('Check Numero Lot['+ sCodeArticle + ']', async () =>{
                        const sNumLot = await pageAchAchFour.fAcheterLabelNumLot.textContent();
                        log.set('Numero de lot pour l\'article '+ sCodeArticle + ' : '+ sNumLot);
                        expect(sNumLot).toBe(oData.aLots[sCodeArticle]);
                    })

                    test('CheckBox [ALL][' + sCodeArticle + ']', async () => {
                        await fonction.clickElement(pageAchAchFour.pPcheckBoxAllLot);
                    })
    
                    test('Button [VOIR DETAIL][' + sCodeArticle + '] - Click', async () => {
                        await fonction.clickAndWait(pageAchAchFour.pPbuttonDetailLot, page);
                    })

                    test.describe('Popin [DETAIL LOTS][' + sCodeArticle + ']', async () => {

                        test('Popin [DETAIL LOTS][' + sCodeArticle + '] - Is Visible', async () => {
                            await fonction.popinVisible(page, 'DETAIL LOTS', true);
                        })

                        test('Icon [CONFIRMER COLIS][' + sCodeArticle + '] -Click', async () => {
                            await fonction.clickAndWait(pageAchAchFour.pPiconConfirmerColis, page);
                        })

                        test('Icon [CONFIRMER COLIS][' + sCodeArticle + '] - Is Not Visible', async () => {
                            const bVisible:boolean = await pageAchAchFour.pPiconConfirmerColis.isVisible();
                            expect(bVisible).not.toBe(true);
                        })
        
                        test('InputField [POIDS CONFIRME LOT][' + sCodeArticle + '] - Type' , async () => {
                            const poidsTheoriqueValue:string = await pageAchAchFour.pPinputPoidsTheorique.inputValue();
                            const poidsTotal:boolean = await pageAchAchFour.pPinputPoidsTotal.isEnabled();
                            if (poidsTotal){
                                await fonction.sendKeys(pageAchAchFour.pPinputPoidsTotal, poidsTheoriqueValue);
                            } else {
                                log.set('Le poids du lot n\'est pas saisissable .');
                            }
                        })
    
                        test('InputField [PRIX TRANSPORT]['+ sCodeArticle + '] = "'+ rPrixTransport +'"' , async () => {
                            const bPrixTransport:boolean = await pageAchAchFour.pPsaisieInputPrixTransport.isEnabled();
                            if (bPrixTransport){
                                await fonction.sendKeys(pageAchAchFour.pPsaisieInputPrixTransport, rPrixTransport);
                            } else {
                                log.set('Le prix du transport n\'est pas saisissable pour l`\'article : ' +sCodeArticle);
                            }
                        })
        
                        test('Button [ENREGISTRER][' + sCodeArticle + '] - Click', async () => {
                            await fonction.clickAndWait(pageAchAchFour.pPbuttonEnregistrerDeLot, page);
                            const bPresent:boolean = await pageAchAchFour.alertErreur.isVisible();
                            if(bPresent){
                                await fonction.clickElement(pageAchAchFour.pPbuttonAlertOuiNon.nth(0));
                            } else {
                               log.set('Conformité de prix de revient');
                            }
                        })
 
                    })
                })
            });
            
            test('Button [CONFIRMETR] - Click', async () => {
                await fonction.clickAndWait(pageAchAchFour.buttonConfirmerAchat, page);
            })

            const sStatuAcha:string = 'Confirmé';
            test('Label [STAUT] = "' + sStatuAcha + '" - Check', async () => {
                test.setTimeout(180000);//La durée du chargement de la page étant un peu longue;
                await expect(pageAchAchFour.spinnerLoading.first()).not.toBeVisible({timeout:180000});
                const sStatuAch:string = await pageAchAchFour.tdStatutAchat.nth(0).textContent();
                expect(sStatuAch).toBe(sStatuAcha);
            })

            //Enregistrement des données pour le E2E
            await fonction.writeData(oData);
        })
    });

    test('Check Flux :',async () =>{
        var oFlux:TypeEsb   =  { 
            "FLUX" : [ 
                {
                    "NOM_FLUX"  : "EnvoyerLot_Stock"
                },
                
                {
                    "NOM_FLUX"  : "EnvoyerLot_Repart"
                }
            ],
            "WAIT_BEFORE"   : 3000,                 // Optionnel
        };

        await esb.checkFlux(oFlux,page);
    })
})
   