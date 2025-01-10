import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface WinnerClaimDialogProps {
  winner: any;
  open: boolean;
  onClose: () => void;
}

const WinnerClaimDialog = ({ winner, open, onClose }: WinnerClaimDialogProps) => {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const claimMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('participants')
        .update({
          prize_claimed: true,
          prize_claimed_at: new Date().toISOString(),
          shipping_address: address,
          phone_number: phone,
          claim_notes: notes
        })
        .eq('id', winner?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contests-with-winners'] });
      toast({
        title: "Prix réclamé avec succès",
        description: "Nous vous contacterons bientôt pour la livraison.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de réclamer le prix. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    claimMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Réclamer votre prix</DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire pour réclamer votre prix. Nous vous contacterons pour organiser la livraison.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="address">Adresse de livraison *</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Entrez votre adresse complète"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Votre numéro de téléphone"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes supplémentaires</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instructions particulières pour la livraison"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={claimMutation.isPending}>
              {claimMutation.isPending ? "Envoi..." : "Réclamer le prix"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WinnerClaimDialog;
