import type { Project, CategoryStat, MemberStat, ProjectStatistics } from '../types';

export function computeStatistics(project: Project): ProjectStatistics {
  const { expenses, categories, members } = project;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Category statistics
  const categoryMap = new Map<string, number>();
  for (const e of expenses) {
    const current = categoryMap.get(e.categoryId) || 0;
    categoryMap.set(e.categoryId, current + e.amount);
  }

  const categoryStats: CategoryStat[] = categories
    .map((cat) => {
      const total = categoryMap.get(cat.id) || 0;
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        total,
        percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
      };
    })
    .sort((a, b) => b.total - a.total);

  // Member statistics
  const memberStats: MemberStat[] = members.map((member) => {
    // Total amount this person paid
    const totalPaid = expenses
      .filter((e) => e.paidBy === member.id)
      .reduce((sum, e) => sum + e.amount, 0);

    // Total amount this person participated in (their share)
    let totalParticipated = 0;
    let expenseCount = 0;

    for (const e of expenses) {
      if (e.participantIds.includes(member.id)) {
        const shareCount = e.participantIds.length;
        totalParticipated += e.amount / shareCount;
        expenseCount++;
      }
    }

    // balance: positive = paid more than share (is owed money)
    //          negative = paid less than share (owes money)
    const balance = totalPaid - totalParticipated;

    return {
      memberId: member.id,
      memberName: member.name,
      totalPaid,
      totalParticipated,
      balance,
      expenseCount,
    };
  });

  // Sort memberStats by totalParticipated descending for ranking
  memberStats.sort((a, b) => b.totalParticipated - a.totalParticipated);

  const averagePerPerson = members.length > 0 ? totalExpenses / members.length : 0;

  return {
    totalExpenses,
    categoryStats,
    memberStats,
    averagePerPerson,
  };
}
