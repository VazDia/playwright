#!/bin/bash 

# @desc : 	Simplifie l'opération de déclaration des variables d'environnement nécessaires au lancement d'un TA Playwright
# 			Permet juste de déclarer n variables d'environnement Windows et de lancer le TA dans la foulée et de
# 			supprimer les variables après le lancement et de générer le rapport Allure.
#			Utilisation : sh playright_start.bash test {NomDuTest.spec.ts} {parametre1=valeur1}n --Autres=Parametres  
#
# EXEMPLE : sh playwright_start.bash ACH/IHM.spec.ts environnement=integration profil=lunettes --workers=1 --debug --reporter=dot fournisseur="Prosol Gestion"
#
# @param {string} le nom du test devant être lancé
# @param {string} le(s) paramètre(s) du TA
#
# REMARQUE: Si parmi les paramètres figure l'argument VERBOSE_MOD, l'application bascule en mode "bavard". ;-)
#           Sont considérés comme paramètres du TA tout argument de la forme "clef=valeur"
#           Les autres paramètres sont ignorés par le TA mais peuvent êtres exploités par Playwright   
#
# @author JC CALVIERA & SIAKA KONE
# @version 1.6
#

SPEC="$1"

parametre1=${1:-"projet="${SPEC:0:3}""}

export projet="${SPEC:0:3}"

# Concaténation des valeurs avec les paramètres par défaut
SPEC="$parametre1 projet="${SPEC:0:3}""

LISTE_PARAMS=""
CYAN='\033[0;36m'
RED='\033[0;31m'
NO_COLOR='\033[0m'

TESTS_FOLDER="c:\pw\playwright\specs"							# Répertoire par défaut contenant les tests
i_NB_PARAMS=0
VERBOSE_MOD=false
STATUT=0                            							# Par défaut il n'y a pas d'erreur
DATE_TIR=$(date +"%Y-%m-%d %H:%M:%S")							# Date de démarrage du test
BROWSER_VERSION=$(<"C:/Reports/TA/jobs/chrome_cypress.txt")		# Fichier contenant le version de Google Chrome
URL='http://recette.prosol.pri/WS/index.php'					# URL du web service du serveur de recette

# Paramètres passés par jenkins
JOB_NAME=""														# Nom du Job								
ID_BUILD=""														# Numéro du Build
ENVIRONNEMENT=""												# Environnement sur lequel a lieu de test


# ----------------------------------------------------------------------------------

function information_message {
	if [[ $VERBOSE_MOD == true ]]; then
  		echo -e "${CYAN}<---- ${1} ---->${NO_COLOR}"
	fi
}

function error_check {
  if [ $? -ne 0 ]; then
    echo -e "${RED}<---- ${1} ---->${NO_COLOR}"
    exit 1
  fi
}

# ----------------------------------------------------------------------------------
# Décommenter la ligne ci-dessous pour afficher les varaibales d'environnement AVANT le traitement
# printenv

if [[ $@ == *"VERBOSE_MOD=true"* ]]; then
	VERBOSE_MOD=true
	echo "--------------------------------------------------------------------------------"
fi

# Le test passé en argument existe t'il ?
if [ -f "$TESTS_FOLDER\\$1" ]; then
    
	information_message "Déclaration variables d'environnement"

	information_message "SET projet=${SPEC:0:3}"

	for var in "$@"
	do
		# Le premier paramètres (le test) est ignoré
		if [[ $i_NB_PARAMS > 0 ]]; then

			# Recherche signature "parametre=valeur"
			if [[ $var == *"="* ]]; then
				
				# Split sur le symbole "="
				IFS='=' read -r -a arrIN <<< "$var"

				# Excecption si la signature est précédée par "--"
				if [[ $var == *"--"* ]]; then
					# Il s'agit d'un paramètre à ne pas ajouter aux variables d'environnement
					LISTE_PARAMS="$LISTE_PARAMS ${var}"
				else
					# Variable d'environnement () 
					param=$(printf "%s" ${arrIN[0]} | tr '[:lower:]' '[:upper:]')
					information_message "SET $param=\"${arrIN[1]}\""
					export $param="${arrIN[1]}"

					# Identification des onformations en provennce de jenkins
					if [[ $param == 'ENVIRONNEMENT' ]]
					then
						ENVIRONNEMENT="${arrIN[1]}"
					fi

					if [[ $param == 'JOB_NAME' ]]
					then
						JOB_NAME="${arrIN[1]}"
					fi

					if [[ $param == 'BUILD_NUMBER' ]]
					then
						ID_BUILD="${arrIN[1]}"
					fi

				fi

			else
				# Il s'agit d'un paramètre à ne pas ajouter aux variables d'environnement
				LISTE_PARAMS="$LISTE_PARAMS ${var}"
			fi
		fi
		i_NB_PARAMS=$i_NB_PARAMS+1
	done

	# Décommenter la ligne ci-dessous pour afficher les varaibales d'environnement PENDANT le traitement
	# printenv

	# -- Chrono Start ------------------------------------------------------
	response=$(curl  --silent -G -d "ws=start" -d "idBuild=${ID_BUILD}" --data-urlencode "bv=${BROWSER_VERSION}" --data-urlencode "env=${ENVIRONNEMENT}" --data-urlencode "ta=$JOB_NAME" --data-urlencode "start=$DATE_TIR" "$URL")
	if [[ $VERBOSE_MOD == true ]]; then
		urlWs="http://recette.prosol.pri/WS/index.php?ws=start&ta='$JOB_NAME'&start=$DATE_TIR&idBuild=$ID_BUILD&bv=$BROWSER_VERSION&env=$ENVIRONNEMENT"
		echo "Chrono Start : ${urlWs}"
		echo "Response from server: $response"
	fi	
	
	# ----------------------------------------------------------------------

	information_message "Lancement : npx playwright test --config=playwright.prod.config.ts $SPEC$LISTE_PARAMS" 

	# ----------------------------------------------------------------------
	cd "c:\pw\playwright"
	retour=$(npx playwright test --config=playwright.prod.config.ts ${SPEC}${LISTE_PARAMS}) 
	# ----------------------------------------------------------------------

	# -- Génération du Rapport Allure --------------------------------------
	information_message "Génération Rapport Allure dans : D:\Reports\TA\jobs\allure"
	allure generate -o D:/Reports/TA/jobs/allure --report-language fr --clean

	information_message "Suppression variables d'environnement"

	information_message "UNSET projet=$projet"	
	unset projet

	for var in "$@"
	do

		if [[ $var == *"="* ]]; then

			arrIN=(${var//=/ })

			if [[ $var != *"--"* ]]; then
				param=$(printf "%s" ${arrIN[0]} | tr '[:lower:]' '[:upper:]')
				information_message "UNSET $param"	
				unset $param
			fi

		fi

	done

else 
	error_check "Le test $TESTS_FOLDER\\$1 est introuvable."
fi

echo "--------------------------------------------------------------------------------"
echo "$retour"

# Recherche du terme "failed" dans le retour de playwright pour déterminer le statut global du test
if [[ $retour =~ .*failed.* ]]
then
    STATUT=1
fi

# -- Chrono End   ------------------------------------------------------
END=$(date +"%Y-%m-%d %H:%M:%S")    # Heure de fin du test (sert au calcul de la durée)
response=$(curl --silent -G -d "ws=end" -d "statut=${STATUT}" --data-urlencode "start=$DATE_TIR" --data-urlencode "end=$END" "$URL")
if [[ $VERBOSE_MOD == true ]]; then
	urlWs="http://recette.prosol.pri/WS/index.php?ws=end&end=${END}&start=${DATE_TIR}&statut=${STATUT}"
	echo "Chrono End : ${urlWs}"
	echo "Response from server: $response"
fi

# ----------------------------------------------------------------------

# Décommenter la ligne ci-dessous pour afficher les varaibales d'environnement APRES le traitement
# printenv

exit $STATUT