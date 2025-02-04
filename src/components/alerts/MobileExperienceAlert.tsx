import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from '@/hooks/use-mobile';

export const MobileExperienceAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Vérifier si l'alerte a déjà été montrée
    const hasShownAlert = localStorage.getItem('hasShownMobileAlert');
    
    if (isMobile && !hasShownAlert) {
      setIsOpen(true);
      // Marquer l'alerte comme montrée
      localStorage.setItem('hasShownMobileAlert', 'true');
    }
  }, [isMobile]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="glass-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-amber-800">
            Conseils pour une meilleure expérience mobile
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Pour une meilleure expérience sur mobile, voici quelques conseils :
            </p>
            <ul className="list-disc pl-4 space-y-2">
              <li>Les articles s'ouvriront dans un nouvel onglet</li>
              <li>Utilisez le bouton "Retour" de votre navigateur pour revenir au concours</li>
              <li>Gardez l'onglet du concours ouvert pendant que vous lisez l'article</li>
            </ul>
            <p className="text-sm text-amber-600 mt-4">
              💡 Pour une expérience optimale, nous recommandons d'utiliser un ordinateur.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={() => setIsOpen(false)}
            className="tropical-button w-full"
          >
            J'ai compris
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};