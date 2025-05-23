USE [PFA_DB]
GO
/****** Object:  Table [dbo].[BudgetList]    Script Date: 03/06/2024 22:23:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BudgetList](
	[Priority] [int] NULL,
	[Description] [varchar](200) NULL,
	[Total_Budget] [int] NULL,
	[Earned_Money] [int] NULL,
	[Status] [bit] NULL,
	[Username] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserDetails]    Script Date: 03/06/2024 22:23:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserDetails](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](50) NOT NULL,
	[Password] [varchar](50) NOT NULL,
	[MonthlyIncome] [int] NOT NULL
) ON [PRIMARY]
GO
INSERT [dbo].[BudgetList] ([Priority], [Description], [Total_Budget], [Earned_Money], [Status], [Username]) VALUES (1, N'asb', 12333, 111, 1, N'ashwin')
INSERT [dbo].[BudgetList] ([Priority], [Description], [Total_Budget], [Earned_Money], [Status], [Username]) VALUES (2, N'dgd', 11222, 333, 1, N'ashwin')
INSERT [dbo].[BudgetList] ([Priority], [Description], [Total_Budget], [Earned_Money], [Status], [Username]) VALUES (3, N'fff', 22222, 111, 1, N'ashwin')
INSERT [dbo].[BudgetList] ([Priority], [Description], [Total_Budget], [Earned_Money], [Status], [Username]) VALUES (4, N'ffss', 11122, 1212, 0, N'ashwin')
INSERT [dbo].[BudgetList] ([Priority], [Description], [Total_Budget], [Earned_Money], [Status], [Username]) VALUES (5, N'ass', 23231, 111, 1, N'ashwin')
INSERT [dbo].[BudgetList] ([Priority], [Description], [Total_Budget], [Earned_Money], [Status], [Username]) VALUES (6, N'iukj', 4567, 11, 0, N'ashwin')
INSERT [dbo].[BudgetList] ([Priority], [Description], [Total_Budget], [Earned_Money], [Status], [Username]) VALUES (7, N'ikud', 33333, 1111, 0, N'ashwin')
INSERT [dbo].[BudgetList] ([Priority], [Description], [Total_Budget], [Earned_Money], [Status], [Username]) VALUES (8, N'uuuu', 22222, 111, 1, N'ashwin')
GO
SET IDENTITY_INSERT [dbo].[UserDetails] ON 

INSERT [dbo].[UserDetails] ([Id], [Username], [Password], [MonthlyIncome]) VALUES (1, N'ashwin', N'ashwin', 35000)
INSERT [dbo].[UserDetails] ([Id], [Username], [Password], [MonthlyIncome]) VALUES (2, N'subra', N'subra', 1222233)
INSERT [dbo].[UserDetails] ([Id], [Username], [Password], [MonthlyIncome]) VALUES (3, N'swathi', N'swathi', 1223)
SET IDENTITY_INSERT [dbo].[UserDetails] OFF
GO
/****** Object:  StoredProcedure [dbo].[SP_DataHandling]    Script Date: 03/06/2024 22:23:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_DataHandling]
	-- Add the parameters for the stored procedure here
	@name nvarchar(100) ='',
	@password nvarchar(100) ='',
	@income int = 0,
	@Type varchar(10) =''
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    if(@Type = 'CreateUser')
	begin
		declare @count int = (select count(*) from UserDetails where Username = @name)
		if (@count = 0)
		begin
			INSERT INTO UserDetails (Username, Password, MonthlyIncome) VALUES (@name, @password, @income)
			select 'success' as Result, @name as Username
		end
		else
		begin
			select 'userexist' as Result
		end
	end
	if(@Type = 'userLogin')
	begin
		declare @cnt int = (select count(*) from UserDetails where Username = @name and [Password] = @password)
		if (@cnt = 1)
		begin
			select 'success' as Result, @name as Username
		end
		else
		begin
			select 'fail' as Result
		end
	end
	if(@Type = 'budgetList')
	begin
		select [Priority],[Description],[Total_Budget],[Earned_Money],[Status] from BudgetList where Username = @name
	end
END
GO
