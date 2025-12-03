import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getIncidentById } from "../actions/get-incident-by-id.action";
import { addIncidentFollowUpAction } from "../actions/add-incident-follow-up.action";
import { AddFollowUpDto } from "../interfaces/add-follow-up.dto";
import { updateIncidentAssigneeAction } from "../actions/update-incident-assignee.action";
import { scheduleIncidentFollowUpAction } from "../actions/schedule-incident-follow-up.action";

export const useIncident = (id: number) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["incident", { id }],
    queryFn: () => getIncidentById(id),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: !!id,
  });

  const addFollowUpMutation = useMutation({
    mutationFn: (followUpData: AddFollowUpDto) =>
      addIncidentFollowUpAction(followUpData),
    onSuccess: () => {
      // Invalidate the follow-ups query to refetch the timeline
      queryClient.invalidateQueries({
        queryKey: ["incidents", id, "follow-ups"],
      });
      // Optionally invalidate the main incident query if status/assignee changes
      queryClient.invalidateQueries({ queryKey: ["incident", { id }] });
    },
    onError: (error) => {
      // Handle error, e.g., show a notification
      console.error("Error adding follow-up:", error);
    },
  });

  const updateAssigneeMutation = useMutation({
    mutationFn: (data: { incidentId: number; userId: number }) =>
      updateIncidentAssigneeAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incident", { id }] });
    },
  });

  const scheduleFollowUpMutation = useMutation({
    mutationFn: (data: { incidentId: number; date: string }) =>
      scheduleIncidentFollowUpAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incident", { id }] });
    },
  });

  return {
    ...query,
    addFollowUp: addFollowUpMutation.mutate,
    updateAssignee: updateAssigneeMutation.mutate,
    scheduleFollowUp: scheduleFollowUpMutation.mutate,
  };
};