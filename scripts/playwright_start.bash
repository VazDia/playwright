#!/bin/bash 

# @desc : 	Simplifie l'opération de déclaration des variables d'environnement nécessaires au lancement d'un TA Playwright
# 			Permet juste de déclarer n variables d'environnement Windows et de lancer le TA dans la foulée et de
# 			supprimer les variables après le lancement
#			Utilisation : sh playright_start.bash test {NomDuTest.spec.ts} {parametre1=valeur1}n --Autres=Parametres  
#
# EXEMPLE : sh playwright_start.bash ACH/IHM.spec.ts environnement=integration profil=lunettes --workers=1 --debug --reporter=dot fournisseur="Prosol Gestion" NB_TIRS=3 VERBOSE_MOD=true
#
# @param {string} le nom du test devant être lancé
# @param {string} le(s) paramètre(s) du TA
#
# REMARQUE: Si parmi les paramètres figure l'argument VERBOSE_MOD, l'application bascule en mode "bavard". ;-)
#           Sont considérés comme paramètres du TA tout argument de la forme "clef=valeur"
#           Les autres paramètres sont ignorés par le TA mais peuvent êtres exploités par Playwright   
#
# PARAMETRES SPECIAUX : 
#				- VERBOSE_MOD=true
#					Affiche les informations de debuggage 
#
#				- NB_TIRS=n
#					Lance n fois le test pour vérifier sa stabilité
#
# @author JC CALVIERA & SIAKA KONE
# @version 1.4
#

SPEC="$1"

parametre1=${1:-"projet="${SPEC:0:3}""}

export projet="${SPEC:0:3}"

# Concaténation des valeurs avec les paramètres par défaut
SPEC="$parametre1 projet="${SPEC:0:3}""

LISTE_PARAMS=""

CYAN='\033[0;36m'
RED='\033[0;31m'
GREEN='\033[0;32m' 
NO_COLOR='\033[0m'

TESTS_FOLDER="c:\pw\playwright\specs"
i_NB_PARAMS=0
VERBOSE_MOD=false
NB_TIRS=0
BREAK_ON_FAILURE=false

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

					if [[ $param == 'NB_TIRS' ]]
					then
						NB_TIRS="${arrIN[1]}"
					fi

					if [[ $param == 'BREAK_ON_FAILURE' ]]
					then
						BREAK_ON_FAILURE=true
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

	information_message "Lancement : npx playwright test $SPEC$LISTE_PARAMS" 

	# ----------------------------------------------------------------------
	cd "c:\pw\playwright"

	if [[ $NB_TIRS > 0 ]]; then						# On souhaite lancer le test NB_TIRS fois pour s'assurer de sa stabilité

		for (( c=1; c<=$NB_TIRS; c++ ))
		do  
			echo "Tir #$c/$NB_TIRS - $(date '+%Y-%m-%d %H:%M:%S')"
			retour=$(npx playwright test ${SPEC}${LISTE_PARAMS} --quiet --reporter=dot)

			# Recherche du terme "failed" dans le retour de playwright pour déterminer le statut global du test
			if [[ $retour =~ .*failed.* ]]
			then
				echo -e "${RED}Failed!${NO_COLOR}"
				if [[ $BREAK_ON_FAILURE == true ]]
				then
					break
				fi
			else
				echo -e "${GREEN}Passed${NO_COLOR}"
			fi
			echo "----------------------------------------------------------------------------------------------"

		done

	else											# On lance le test normalement

		npx playwright test $SPEC$LISTE_PARAMS 

	fi
	# ----------------------------------------------------------------------

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

# Décommenter la ligne ci-dessous pour afficher les varaibales d'environnement APRES le traitement
# printenv