/**
 * 
 * @author JC CALVIERA
 * @since 2024-01-29
 * 
 */

const xRefTest      = "PRE_TAC_ADD";
const xDescription  = "Création d'une tâche";
const xIdTest       =  331;
const xVersion      = '3.1';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'PRE',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page }          from '@playwright/test';

import { Help }                     from '@helpers/helpers.js';
import { TestFunctions }            from '@helpers/functions.js';
import { Log }                      from '@helpers/log.js';

import { GlobalConfigFile }         from '@conf/commun.conf';

import { MenuPreparation }          from '@pom/PRE/menu.page.js';
import { AurtresTacheDuJourPage }   from '@pom/PRE/travaux-taches_jour.page';

import { AutoComplete, CartoucheInfo } from '@commun/types';

//------------------------------------------------------------------------------------

let page                : Page;
let menu                : MenuPreparation;
let pageTravaux         : AurtresTacheDuJourPage;

//------------------------------------------------------------------------------------

const log               = new Log();
const globalConfig      = new GlobalConfigFile();
const fonction          = new TestFunctions(log);

const iDateRange        = 18;       // Range 00:00 - 18:00
const sCommentaire      = 'TEST-AUTO_commentaire-' + fonction.getToday();
const iHeureStart       = Math.floor(fonction.random() * iDateRange);
const iHeureEnd         = fonction.addZero(iHeureStart + Math.floor(fonction.random() * 5));
const iMinuteStart      = fonction.addZero(Math.floor(fonction.random() * 59));
const iMinuteEnd        = fonction.addZero(Math.floor(fonction.random() * 59));
const sLettre           = fonction.getRandomLetter();

//------------------------------------------------------------------------------------

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
    page        = await browser.newPage();
    menu        = new MenuPreparation(page, fonction);
    pageTravaux = new AurtresTacheDuJourPage(page);
});

test.afterAll(async () => {
    await fonction.close();
});

//------------------------------------------------------------------------------------

test.describe('[' + xRefTest + ']' , () => {
    
    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper    = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
        await fonction.openUrl(page);
    });

    test('Connexion', async () => {
        await fonction.connexion(page);
    });

    test.describe('Page [AUTRES TRAVAUX]', async () => {   

        var sNomPage = 'travaux';
        test ('Page [AUTRES TRAVAUX] - Click', async () => {
            await menu.click(sNomPage, page);
        }); 
        
        test('Message [ERREUR] - Is Not Visible', async () => {
            await fonction.isErrorDisplayed(false, page);
        }) 

        var sNomPopin = 'CREER UNE TACHE';
        test.describe('Popin [' + sNomPopin.toUpperCase() + ']', async () => {
                
            test('Button [CREER UNE TACHE]- Click', async () => {
                await fonction.clickElement(pageTravaux.buttonTacheAdd);
            }); 
            
            test('Message [ERREUR] - Is Not Visible', async () => {
                await fonction.isErrorDisplayed(false, page);
            }) 

            test('InputField [PREPARATEUR] = rnd', async () => {
                var oData:AutoComplete = {
                    libelle         :'PREPARATEUR',
                    inputLocator    : pageTravaux.pInputPrepareteur,
                    inputValue      : sLettre,
                    choiceSelector  :'li.gfit-autocomplete-result',
                    choicePosition  : 0,
                    typingDelay     : 100,
                    waitBefore      : 500,
                    page            : page,
                };
                await fonction.autoComplete(oData);
                var sNomPreparateur = await pageTravaux.pInputPrepareteur.textContent();
                log.set('Préparateur : ' + sNomPreparateur);
            })

            test('ListBox [TACHE][rnd] - Select', async () => { 
                var iNbChoix = await pageTravaux.pListBoxTache.locator('option').count();
                var iRnd = Math.floor(fonction.random() * iNbChoix);
                var sChoix = await pageTravaux.pListBoxTache.locator('option').nth(iRnd).textContent();
                await pageTravaux.pListBoxTache.selectOption(sChoix);
                log.set('Tâche : ' + sChoix);
            });

            test('Input [HEURE DEBUT] = rnd', async () => {
                await fonction.sendKeys(pageTravaux.pInputHeureDebut, fonction.addZero(iHeureStart));
            })

            test('Input [MINUTE DEBUT] = rnd', async () => {
                await fonction.sendKeys(pageTravaux.pInputMinuteDebut, iMinuteStart);
                log.set('Heure début : ' + iHeureStart + ':' + iMinuteStart);
            })

            test('Input [HEURE FIN] = rnd', async () => {
                await fonction.sendKeys(pageTravaux.pInputHeureFin, iHeureEnd);
            })

            test('Input [MINUTE FIN] = rnd', async () => {
                await fonction.sendKeys(pageTravaux.pInputMinuteFin, iMinuteEnd);
                log.set('Heure début : ' + iHeureEnd + ':' + iMinuteEnd);
            })

            test('Input [COMMENTAIRE] = "' + sCommentaire + '"', async () => {
                await fonction.sendKeys(pageTravaux.pTextAreaCommentaire, sCommentaire);
            })

            test('Button [CREER]- Click', async () => {
                await fonction.clickAndWait(pageTravaux.pButtonCreer, page);
            }); 

        }); //-- End Popin

    }); //-- End Describe Page

    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

});   