import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Skeleton,
} from "@chakra-ui/react";

const SkeletonTable = () => {
	const skeletonRows = Array.from({ length: 10 }, (_, index) => (
		<Tr key={index}>
			<Td>
				<Skeleton height="20px" />
			</Td>
			<Td>
				<Skeleton height="20px" />
			</Td>
			<Td>
				<Skeleton height="20px" />
			</Td>
			<Td>
				<Skeleton height="20px" />
			</Td>
			<Td>
				<Skeleton height="20px" />
			</Td>
		</Tr>
	));
	return (
		<TableContainer className="mt-8">
			<Table variant="simple" size="md">
				<Thead>
					<Tr>
						<Th className="w-fit">Amount</Th>
						<Th className="w-full">Description</Th>
						<Th>Date</Th>
						<Th className="w-fit">Type</Th>
						<Th>Action</Th>
					</Tr>
				</Thead>
				<Tbody>{skeletonRows}</Tbody>
			</Table>
		</TableContainer>
	);
};

export default SkeletonTable;
