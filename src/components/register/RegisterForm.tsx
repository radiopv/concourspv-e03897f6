import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const registerSchema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

const RegisterForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
  });

  const initializeUserData = async (userId: string, userData: z.infer<typeof registerSchema>) => {
    try {
      // Create member record
      const { error: memberError } = await supabase
        .from('members')
        .insert({
          id: userId,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          total_points: 0,
          contests_participated: 0,
          contests_won: 0,
        });

      if (memberError) throw memberError;

      // Initialize user points
      const { error: pointsError } = await supabase
        .from('user_points')
        .insert({
          user_id: userId,
          total_points: 0,
          current_streak: 0,
          best_streak: 0,
          current_rank: 'BEGINNER',
          extra_participations: 0,
        });

      if (pointsError) throw pointsError;

    } catch (error) {
      console.error('Error initializing user data:', error);
      throw error;
    }
  };

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      console.log("Tentative d'inscription avec:", values.email);

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
          },
        },
      });

      if (error) {
        console.error("Erreur d'inscription:", error);
        toast({
          variant: "destructive",
          title: "Erreur lors de l'inscription",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        console.log("Inscription réussie, initialisation des données utilisateur");
        
        await initializeUserData(data.user.id, values);

        toast({
          title: "Inscription réussie !",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
        });

        navigate('/login');
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des données:", error);
      toast({
        variant: "destructive",
        title: "Erreur lors de l'inscription",
        description: "Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          S'inscrire
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;