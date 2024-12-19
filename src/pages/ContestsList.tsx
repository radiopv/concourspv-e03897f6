// Remove the index prop when passing to ContestCard
return (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {contests?.map((contest) => (
      <ContestCard
        key={contest.id}
        contest={contest}
        onSelect={setSelectedContest}
      />
    ))}
  </div>
);