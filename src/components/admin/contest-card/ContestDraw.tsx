<lov-code>
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { Button } from "@/components/ui/button";
import { Trophy, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DrawScheduler from "../draw/DrawScheduler";
import DrawHistory from "../draw/DrawHistory";
import { drawService } from "../draw/draw