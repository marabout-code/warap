-- =====================================================================
-- warap - Migration 004 : politiques RLS du rôle agent
-- ---------------------------------------------------------------------
-- À exécuter APRÈS la migration 003_domestic_hiring.sql : les politiques
-- ci-dessous utilisent la valeur 'agent' de l'enum user_role, qui ne peut
-- être utilisée qu'une fois ajoutée ET engagée (transaction séparée).
--
-- Les politiques SELECT sont de type permissif : elles s'additionnent aux
-- politiques existantes de la migration 001.
--
-- Réexécutable (DROP + CREATE).
-- =====================================================================

-- Un agent peut consulter toutes les candidatures (pour les vérifier)
DROP POLICY IF EXISTS "Agents can view applications" ON public.applications;
CREATE POLICY "Agents can view applications" ON public.applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agent')
  );

-- Un agent ou un admin peut mettre à jour une candidature
-- (statut de vérification, notes, documents). À restreindre par colonne
-- si on souhaite interdire la modification du statut du recrutement.
DROP POLICY IF EXISTS "Agents and admins can update applications" ON public.applications;
CREATE POLICY "Agents and admins can update applications" ON public.applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );