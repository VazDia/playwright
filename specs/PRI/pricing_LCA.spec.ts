/**
 * 
 * PRICING APPLICATION > CONNEXION
 * 
 * @author Vazoumana Diarrassouba
 * @since 2023/10/11
 * 
 */

import { test, type Page, expect }          from '@playwright/test';

import { Help }                             from '../../utils/helpers.js';
import { TestFunctions }                    from '../../utils/functions.js';
import { Log }                              from '../../utils/log';
import { Credential }                       from '../../conf/environnements/credential.conf.js';

import { Authentificationpage }             from '../../pages/COMMUN/authentification.page.js';

import { MenuPricing }                      from '../../pages/PRI/menu.page.js';

const xRefTest      = "PRI_LCA_CHK";
const xDescription  = "Examine la Liste de Contrôle d'Accès PRICING";
const xIdTest       =  1612;
const xVersion      = '3.3';

var info = {
    desc        : xDescription,
    appli       : 'PRI',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//------------------------------------------------------------------------------------
test.describe.configure({ mode: 'serial' });

let page                : Page;
let log                 : Log;

let pageObjectAuth      : Authentificationpage;

let menu                : MenuPricing;

const fonction          = new TestFunctions();
const profil            = 'lunettes';
const userCredential    = new Credential(profil);

var profilData          = userCredential.getData();
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }) => {
    page                = await browser.newPage();    
    log                 = new Log();

    pageObjectAuth      = new Authentificationpage(page);
    menu                = new MenuPricing(page);
});

test.afterAll(async () => {
    await fonction.close();
})

//------------------------------------------------------------------------------------

test.describe ('[' + xRefTest + ']', () => {

    var injects			=  [
        [false, '', ''],
        [false, 'Foo', 'Bar'],
        [false, profilData.login, ''],
        [false, '', profilData.password],
        [false, "' or '1' = '1", "' or '1' = '1"],
        [false, "' OR 1=1'); //", "' OR 1=1'); //"]
    ];

    test('-- Start --', async ({ context }, testInfo) => {
        await context.clearCookies();
        const helper    = new Help(info, testInfo, page);
        await helper.init();
    });

    test('Ouverture URL', async() => {
          await fonction.openUrl(page);
    });

    test.describe('Login - Wrong Parameters >', async () => {
		
		injects.forEach(async (data) => {

			var expected	= data[0];
			var login 		= data[1];
			var password 	= data[2];

			test('Login: [ ' + login + ' ] / Pwd: [ ' + password + ' ]', async () => {
                await pageObjectAuth.setJUsername(login);
                await pageObjectAuth.setJPassword(password);
                await pageObjectAuth.clickConnexionButton(page);
				expect(pageObjectAuth.isErrorDisplayed() == expected);
			});			
		});
	});    

    test.describe('Login - Right Parameters >', async () => {

		var login 		= profilData.login;
		var password	= profilData.password;
		
		test('Login: [ ' + login + ' ] / Pwd: [ ' + password + ' ]', async () => {
			await pageObjectAuth.setJUsername(login);
			await pageObjectAuth.setJPassword(password);
			await pageObjectAuth.clickConnexionButton(page);					  
		})

        test('ListBox [USER] - Is Visible', async () => {
            menu.listBoxUser.isVisible();
        })
	})
   
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });
})